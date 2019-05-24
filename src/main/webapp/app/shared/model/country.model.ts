export interface ICountry {
  id?: number;
  countryName?: string;
  note?: string;
}

export class Country implements ICountry {
  constructor(public id?: number, public countryName?: string, public note?: string) {}
}
