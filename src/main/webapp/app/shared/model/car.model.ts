import { IOwner } from 'app/shared/model/owner.model';

export interface ICar {
  id?: number;
  name?: string;
  owner?: IOwner;
}

export class Car implements ICar {
  constructor(public id?: number, public name?: string, public owner?: IOwner) {}
}
