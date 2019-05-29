import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SimpleJhipsterSharedModule } from 'app/shared';
import {
  LibraryComponent,
  LibraryDetailComponent,
  LibraryUpdateComponent,
  LibraryDeletePopupComponent,
  LibraryDeleteDialogComponent,
  libraryRoute,
  libraryPopupRoute
} from './';

const ENTITY_STATES = [...libraryRoute, ...libraryPopupRoute];

@NgModule({
  imports: [SimpleJhipsterSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    LibraryComponent,
    LibraryDetailComponent,
    LibraryUpdateComponent,
    LibraryDeleteDialogComponent,
    LibraryDeletePopupComponent
  ],
  entryComponents: [LibraryComponent, LibraryUpdateComponent, LibraryDeleteDialogComponent, LibraryDeletePopupComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimpleJhipsterLibraryModule {}
