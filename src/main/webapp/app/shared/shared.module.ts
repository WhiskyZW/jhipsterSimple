import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SimpleJhipsterSharedLibsModule, SimpleJhipsterSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective } from './';

@NgModule({
  imports: [SimpleJhipsterSharedLibsModule, SimpleJhipsterSharedCommonModule],
  declarations: [JhiLoginModalComponent, HasAnyAuthorityDirective],
  entryComponents: [JhiLoginModalComponent],
  exports: [SimpleJhipsterSharedCommonModule, JhiLoginModalComponent, HasAnyAuthorityDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimpleJhipsterSharedModule {
  static forRoot() {
    return {
      ngModule: SimpleJhipsterSharedModule
    };
  }
}
