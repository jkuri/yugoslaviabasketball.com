import { differenceInYears } from 'date-fns';

export class Player {
  age: number;

  constructor(
    public name: string,
    public lastname: string,
    public birthdate: Date,
    public height: number,
    public weight: number,
    public club: string,
    public avatar: string
  ) {
    this.age = differenceInYears(new Date(), this.birthdate);
  }
}
