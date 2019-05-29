import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ILibrary, Library } from 'app/shared/model/library.model';
import { LibraryService } from './library.service';
import { IAdmin } from 'app/shared/model/admin.model';
import { AdminService } from 'app/entities/admin';

@Component({
  selector: 'jhi-library-update',
  templateUrl: './library-update.component.html'
})
export class LibraryUpdateComponent implements OnInit {
  library: ILibrary;
  isSaving: boolean;

  admins: IAdmin[];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]]
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected libraryService: LibraryService,
    protected adminService: AdminService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ library }) => {
      this.updateForm(library);
      this.library = library;
    });
    this.adminService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IAdmin[]>) => mayBeOk.ok),
        map((response: HttpResponse<IAdmin[]>) => response.body)
      )
      .subscribe((res: IAdmin[]) => (this.admins = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(library: ILibrary) {
    this.editForm.patchValue({
      id: library.id,
      name: library.name,
      address: library.address
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const library = this.createFromForm();
    if (library.id !== undefined) {
      this.subscribeToSaveResponse(this.libraryService.update(library));
    } else {
      this.subscribeToSaveResponse(this.libraryService.create(library));
    }
  }

  private createFromForm(): ILibrary {
    const entity = {
      ...new Library(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      address: this.editForm.get(['address']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILibrary>>) {
    result.subscribe((res: HttpResponse<ILibrary>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackAdminById(index: number, item: IAdmin) {
    return item.id;
  }
}
