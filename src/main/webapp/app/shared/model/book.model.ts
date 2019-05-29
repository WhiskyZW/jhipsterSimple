import { IAuthor } from 'app/shared/model/author.model';
import { ILibrary } from 'app/shared/model/library.model';

export interface IBook {
  id?: number;
  name?: string;
  description?: string;
  writer?: IAuthor;
  library?: ILibrary;
}

export class Book implements IBook {
  constructor(public id?: number, public name?: string, public description?: string, public writer?: IAuthor, public library?: ILibrary) {}
}
