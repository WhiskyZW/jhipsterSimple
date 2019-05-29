import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { IAdmin, Admin } from 'app/shared/model/admin.model';
import { AdminService } from './admin.service';
import { ILibrary } from 'app/shared/model/library.model';
import { LibraryService } from 'app/entities/library';
import { IAuthor } from 'app/shared/model/author.model';
import { AuthorService } from 'app/entities/author';

@Component({
  selector: 'jhi-admin-update',
  templateUrl: './admin-update.component.html'
})
export class AdminUpdateComponent implements OnInit {
  admin: IAdmin;
  isSaving: boolean;

  libraries: ILibrary[];

  authors: IAuthor[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    library: [],
    author: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected adminService: AdminService,
    protected libraryService: LibraryService,
    protected authorService: AuthorService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ admin }) => {
      this.updateForm(admin);
      this.admin = admin;
    });
    this.libraryService
      .query({ filter: 'admin-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<ILibrary[]>) => mayBeOk.ok),
        map((response: HttpResponse<ILibrary[]>) => response.body)
      )
      .subscribe(
        (res: ILibrary[]) => {
          if (!this.admin.library || !this.admin.library.id) {
            this.libraries = res;
          } else {
            this.libraryService
              .find(this.admin.library.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<ILibrary>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<ILibrary>) => subResponse.body)
              )
              .subscribe(
                (subRes: ILibrary) => (this.libraries = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
    this.authorService
      .query({ filter: 'admin-is-null' })
      .pipe(
        filter((mayBeOk: HttpResponse<IAuthor[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAuthor[]>) => response.body)
      )
      .subscribe(
        (res: IAuthor[]) => {
          if (!this.admin.author || !this.admin.author.id) {
            this.authors = res;
          } else {
            this.authorService
              .find(this.admin.author.id)
              .pipe(
                filter((subResMayBeOk: HttpResponse<IAuthor>) => subResMayBeOk.ok),
                map((subResponse: HttpResponse<IAuthor>) => subResponse.body)
              )
              .subscribe(
                (subRes: IAuthor) => (this.authors = [subRes].concat(res)),
                (subRes: HttpErrorResponse) => this.onError(subRes.message)
              );
          }
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  updateForm(admin: IAdmin) {
    this.editForm.patchValue({
      id: admin.id,
      name: admin.name,
      library: admin.library,
      author: admin.author
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const admin = this.createFromForm();
    if (admin.id !== undefined) {
      this.subscribeToSaveResponse(this.adminService.update(admin));
    } else {
      this.subscribeToSaveResponse(this.adminService.create(admin));
    }
  }

  private createFromForm(): IAdmin {
    const entity = {
      ...new Admin(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      library: this.editForm.get(['library']).value,
      author: this.editForm.get(['author']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdmin>>) {
    result.subscribe((res: HttpResponse<IAdmin>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackLibraryById(index: number, item: ILibrary) {
    return item.id;
  }

  trackAuthorById(index: number, item: IAuthor) {
    return item.id;
  }
}
