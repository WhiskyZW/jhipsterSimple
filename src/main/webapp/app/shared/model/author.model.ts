import { IBook } from 'app/shared/model/book.model';

export interface IAuthor {
  id?: number;
  name?: string;
  age?: number;
  sex?: string;
  books?: IBook[];
}

export class Author implements IAuthor {
  constructor(public id?: number, public name?: string, public age?: number, public sex?: string, public books?: IBook[]) {}
}
