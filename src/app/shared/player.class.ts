import { differenceInYears } from 'date-fns';

export class Player {
  constructor(
    public name: string,
    public lastname: string,
    public birthdate: Date,
    public height: number,
    public weight: number,
    public club: string,
    public avatar: string
  ) { }

  getAge(): number {
    return differenceInYears(new Date(), this.birthdate);
  }
}
