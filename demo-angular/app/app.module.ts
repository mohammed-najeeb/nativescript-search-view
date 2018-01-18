import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppComponent } from "./app.component";
import {SearchViewModule} from 'nativescript-search-view/angular';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [NativeScriptModule,
    SearchViewModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
