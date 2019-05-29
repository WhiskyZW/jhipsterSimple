import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'country',
        loadChildren: './country/country.module#SimpleJhipsterCountryModule'
      },
      {
        path: 'location',
        loadChildren: './location/location.module#SimpleJhipsterLocationModule'
      },
      {
        path: 'department',
        loadChildren: './department/department.module#SimpleJhipsterDepartmentModule'
      },
      {
        path: 'task',
        loadChildren: './task/task.module#SimpleJhipsterTaskModule'
      },
      {
        path: 'employee',
        loadChildren: './employee/employee.module#SimpleJhipsterEmployeeModule'
      },
      {
        path: 'job',
        loadChildren: './job/job.module#SimpleJhipsterJobModule'
      },
      {
        path: 'job-history',
        loadChildren: './job-history/job-history.module#SimpleJhipsterJobHistoryModule'
      },
      {
        path: 'country',
        loadChildren: './country/country.module#SimpleJhipsterCountryModule'
      },
      {
        path: 'country',
        loadChildren: './country/country.module#SimpleJhipsterCountryModule'
      },
      {
        path: 'country',
        loadChildren: './country/country.module#SimpleJhipsterCountryModule'
      },
      {
        path: 'book',
        loadChildren: './book/book.module#SimpleJhipsterBookModule'
      },
      {
        path: 'author',
        loadChildren: './author/author.module#SimpleJhipsterAuthorModule'
      },
      {
        path: 'library',
        loadChildren: './library/library.module#SimpleJhipsterLibraryModule'
      },
      {
        path: 'library',
        loadChildren: './library/library.module#SimpleJhipsterLibraryModule'
      },
      {
        path: 'admin',
        loadChildren: './admin/admin.module#SimpleJhipsterAdminModule'
      },
      {
        path: 'car',
        loadChildren: './car/car.module#SimpleJhipsterCarModule'
      },
      {
        path: 'owner',
        loadChildren: './owner/owner.module#SimpleJhipsterOwnerModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimpleJhipsterEntityModule {}
