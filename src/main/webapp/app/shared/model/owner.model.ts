export interface IOwner {
  id?: number;
  name?: string;
  age?: number;
}

export class Owner implements IOwner {
  constructor(public id?: number, public name?: string, public age?: number) {}
}
