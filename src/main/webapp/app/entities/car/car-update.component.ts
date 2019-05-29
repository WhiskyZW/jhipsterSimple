import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiAlertService } from 'ng-jhipster';
import { ICar, Car } from 'app/shared/model/car.model';
import { CarService } from './car.service';
import { IOwner } from 'app/shared/model/owner.model';
import { OwnerService } from 'app/entities/owner';

@Component({
  selector: 'jhi-car-update',
  templateUrl: './car-update.component.html'
})
export class CarUpdateComponent implements OnInit {
  car: ICar;
  isSaving: boolean;

  owners: IOwner[];

  editForm = this.fb.group({
    id: [],
    name: [],
    owner: []
  });

  constructor(
    protected jhiAlertService: JhiAlertService,
    protected carService: CarService,
    protected ownerService: OwnerService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ car }) => {
      this.updateForm(car);
      this.car = car;
    });
    this.ownerService
      .query()
      .pipe(
        filter((mayBeOk: HttpResponse<IOwner[]>) => mayBeOk.ok),
        map((response: HttpResponse<IOwner[]>) => response.body)
      )
      .subscribe((res: IOwner[]) => (this.owners = res), (res: HttpErrorResponse) => this.onError(res.message));
  }

  updateForm(car: ICar) {
    this.editForm.patchValue({
      id: car.id,
      name: car.name,
      owner: car.owner
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const car = this.createFromForm();
    if (car.id !== undefined) {
      this.subscribeToSaveResponse(this.carService.update(car));
    } else {
      this.subscribeToSaveResponse(this.carService.create(car));
    }
  }

  private createFromForm(): ICar {
    const entity = {
      ...new Car(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      owner: this.editForm.get(['owner']).value
    };
    return entity;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICar>>) {
    result.subscribe((res: HttpResponse<ICar>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

  trackOwnerById(index: number, item: IOwner) {
    return item.id;
  }
}
