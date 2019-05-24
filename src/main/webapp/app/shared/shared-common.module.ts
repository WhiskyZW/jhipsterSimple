import { NgModule } from '@angular/core';

import { SimpleJhipsterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
  imports: [SimpleJhipsterSharedLibsModule],
  declarations: [JhiAlertComponent, JhiAlertErrorComponent],
  exports: [SimpleJhipsterSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class SimpleJhipsterSharedCommonModule {}
