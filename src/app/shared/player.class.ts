import { differenceInYears } from 'date-fns';

export class Player {
  age: number;

  constructor(
    public id: number,
    public name: string,
    public lastname: string,
    public birthdate: Date,
    public height: number,
    public weight: number,
    public club: string,
    public avatar: string,
    public number: number,
    public position: 'C' | 'PF' | 'SF' | 'SG' | 'PG',
    public birthplace: string,
    public notes: string
  ) {
    this.age = differenceInYears(new Date(), this.birthdate);
  }
}
