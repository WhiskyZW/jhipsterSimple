import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { ILibrary } from 'app/shared/model/library.model';
import { AccountService } from 'app/core';
import { LibraryService } from './library.service';

@Component({
  selector: 'jhi-library',
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit, OnDestroy {
  libraries: ILibrary[];
  currentAccount: any;
  eventSubscriber: Subscription;

  constructor(
    protected libraryService: LibraryService,
    protected jhiAlertService: JhiAlertService,
    protected eventManager: JhiEventManager,
    protected accountService: AccountService
  ) {}

  loadAll() {
    this.libraryService
      .query()
      .pipe(
        filter((res: HttpResponse<ILibrary[]>) => res.ok),
        map((res: HttpResponse<ILibrary[]>) => res.body)
      )
      .subscribe(
        (res: ILibrary[]) => {
          this.libraries = res;
        },
        (res: HttpErrorResponse) => this.onError(res.message)
      );
  }

  ngOnInit() {
    this.loadAll();
    this.accountService.identity().then(account => {
      this.currentAccount = account;
    });
    this.registerChangeInLibraries();
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ILibrary) {
    return item.id;
  }

  registerChangeInLibraries() {
    this.eventSubscriber = this.eventManager.subscribe('libraryListModification', response => this.loadAll());
  }

  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
