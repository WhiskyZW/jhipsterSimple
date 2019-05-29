import { IBook } from 'app/shared/model/book.model';
import { IAdmin } from 'app/shared/model/admin.model';

export interface ILibrary {
  id?: number;
  name?: string;
  address?: string;
  books?: IBook[];
  admin?: IAdmin;
}

export class Library implements ILibrary {
  constructor(public id?: number, public name?: string, public address?: string, public books?: IBook[], public admin?: IAdmin) {}
}
