import {
  Component,
  OnInit,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  scaleTime,
  scaleLinear,
  line,
  select,
  extent,
  min,
  max,
  axisLeft,
  axisBottom,
  timeFormat,
  curveLinear
} from 'd3';
import { ResizeService } from '../shared/resize.service';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

export class LineChartSettings {
  constructor(
    public margin: { top: number; right: number; bottom: number; left: number } = {
      top: 10,
      right: 30,
      bottom: 40,
      left: 50
    },
    public lineColor: string = '#6B6C6F',
    public showDots: boolean = true,
    public showTooltip: boolean = true,
    public yMinMax: { min: number; max: number } = { min: null, max: null }
  ) {}
}

@Component({
  selector: 'app-line-chart',
  template: `<div class="line-chart"></div>`
})
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() values: { date: Date; value: number; notes?: string }[];
  @Input() settings: LineChartSettings = new LineChartSettings();

  el: HTMLElement;
  data: { date: any; value: number }[];
  width: number;
  height: number;
  x: any;
  y: any;
  line: any;
  svg: any;
  g: any;
  xAxis: any;
  yAxis: any;
  path: any;
  gdots: any;
  resizeSubsciption: Subscription;

  constructor(
    public elementRef: ElementRef,
    public resizeService: ResizeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.el = this.elementRef.nativeElement.querySelector('.line-chart');
    this.initChart();

    this.resizeSubsciption = this.resizeService.onResize$
      .pipe(debounceTime(300))
      .subscribe(() => this.reinitChat());
  }

  ngOnChanges() {
    if (!this.el || isPlatformServer(this.platformId)) {
      return;
    }

    this.data = this.values;
    this.updateChart();
  }

  ngOnDestroy() {
    if (this.resizeSubsciption) {
      this.resizeSubsciption.unsubscribe();
    }
  }

  private initChart(): void {
    this.data = this.values || [];

    this.width = this.el.clientWidth - this.settings.margin.left - this.settings.margin.right;
    this.height = this.el.clientHeight - this.settings.margin.top - this.settings.margin.bottom;

    this.x = scaleTime().range([0, this.width]);
    this.y = scaleLinear().range([this.height, 0]);

    this.line = line()
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value))
      .curve(curveLinear);

    this.svg = select(this.el)
      .append('svg')
      .attr('width', this.width + this.settings.margin.left + this.settings.margin.right)
      .attr('height', this.height + this.settings.margin.top + this.settings.margin.bottom);

    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${this.settings.margin.left}, ${this.settings.margin.top})`);

    const defs = this.svg.append('defs');

    defs
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.parseDataAndSetDomains();

    this.xAxis = this.g
      .append('g')
      .attr('class', 'x axis')
      .call(axisBottom(this.x).tickSize(-this.height).tickFormat(timeFormat('%Y')).tickPadding(8))
      .attr('transform', `translate(0, ${this.height})`);

    this.yAxis = this.g
      .append('g')
      .attr('class', 'y axis')
      .call(axisLeft(this.y).tickSize(-this.width).ticks(6).tickPadding(20));

    this.path = this.g
      .append('path')
      .datum(this.data)
      .attr('class', 'line')
      .attr('d', this.line)
      .attr('stroke', this.settings.lineColor);

    this.gdots = this.g.append('g');
    this.drawDots();
  }

  private updateChart(): void {
    this.parseDataAndSetDomains();

    this.gdots.selectAll('.dot').remove();

    this.gdots
      .selectAll('.dot')
      .transition()
      .duration(500)
      .style('opacity', 0)
      .on('end', () => {
        this.gdots.selectAll('.dot').remove();
        this.drawDots();
      });

    this.xAxis
      .transition()
      .duration(1000)
      .call(axisBottom(this.x).tickSize(0).tickFormat(timeFormat('%Y')).tickPadding(8));

    this.yAxis
      .transition()
      .duration(1000)
      .call(axisLeft(this.y).tickSize(-this.width).ticks(10).tickPadding(20));

    this.path
      .transition()
      .duration(1000)
      .attr('d', this.line(this.data))
      .on('end', () => this.drawDots());
  }

  private reinitChat(): void {
    select(this.el).select('.line-chart > svg').remove();
    this.initChart();
  }

  private parseDataAndSetDomains(): void {
    this.data = this.data.map(d => ({ date: new Date(d.date), value: d.value }));
    this.x.domain(extent(this.data, (d: any) => d.date));

    if (this.settings.yMinMax.min !== null && this.settings.yMinMax !== null) {
      this.y.domain([this.settings.yMinMax.min, this.settings.yMinMax.max]);
    } else {
      this.y.domain([min(this.data, (d: any) => d.value), max(this.data, (d: any) => d.value)]);
    }
  }

  private drawDots(): void {
    this.gdots
      .selectAll('.dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3)
      .attr('cx', (d: any, i: number) => this.x(d.date))
      .attr('cy', (d: any) => this.y(d.value))
      .attr('fill', '#FFFFFF')
      .attr('stroke', this.settings.lineColor)
      .attr('stroke-width', 2)
      .attr('opacity', 0);

    this.gdots.selectAll('.dot').transition().duration(750).style('opacity', 1);
  }
}
