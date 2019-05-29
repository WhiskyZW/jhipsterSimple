import { ILibrary } from 'app/shared/model/library.model';
import { IAuthor } from 'app/shared/model/author.model';

export interface IAdmin {
  id?: number;
  name?: string;
  library?: ILibrary;
  author?: IAuthor;
}

export class Admin implements IAdmin {
  constructor(public id?: number, public name?: string, public library?: ILibrary, public author?: IAuthor) {}
}
