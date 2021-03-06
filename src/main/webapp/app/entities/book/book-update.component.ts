import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IBook, Book } from 'app/shared/model/book.model';
import { BookService } from './book.service';
import { IAuthor } from 'app/shared/model/author.model';
import { AuthorService } from 'app/entities/author';
import { ILibrary } from 'app/shared/model/library.model';
import { LibraryService } from 'app/entities/library';

@Component({
  selector: 'jhi-book-update',
  templateUrl: './book-update.component.html'
})
export class BookUpdateComponent implements OnInit {
  book: IBook;
  isSaving: boolean;

  authors: IAuthor[];

  libraries: ILibrary[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    description: [],
    writer: [null, Validators.required],
    library: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected bookService: BookService,
    protected authorService: AuthorService,
    protected libraryService: LibraryService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ book }) => {
      this.updateForm(book);
      this.book = book;
    });
    this.authorService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IAuthor[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAuthor[]>) => response.body)
      )
      .subscribe((res: IAuthor[]) => (this.authors = res), (res: HttpErrorResponse) => this.onError(res.message));
    this.libraryService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<ILibrary[]>) => mayBeOk.ok),
        map((response: HttpResponse<ILibrary[]>) => response.body)
      )
      .subscribe((res: ILibrary[]) => (this.libraries = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(book: IBook) {
    this.editForm.patchValue({
      id: book.id,
      name: book.name,
      description: book.description,
      writer: book.writer,
      library: book.library
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const book = this.createFromForm();
    if (book.id !== undefined) {
      this.subscribeToSaveResponse(this.bookService.update(book));
    } else {
      this.subscribeToSaveResponse(this.bookService.create(book));
    }
  }

  private createFromForm(): IBook {
    const entity = {
      ...new Book(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      description: this.editForm.get(['description']).value,
      writer: this.editForm.get(['writer']).value,
      library: this.editForm.get(['library']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBook>>) {
    result.subscribe((res: HttpResponse<IBook>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }

  trackAuthorById(index: number, item: IAuthor) {
    return item.id;
  }

  trackLibraryById(index: number, item: ILibrary) {
    return item.id;
  }
}
