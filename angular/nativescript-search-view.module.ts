import { NgModule } from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR } from "@angular/forms";
import { registerElement } from "nativescript-angular/element-registry";

import { DIRECTIVES } from "./nativescript-search-view.directives";

registerElement("SearchView", () => require("../").SearchView);

@NgModule({
    declarations: [DIRECTIVES],
    exports: [FormsModule, DIRECTIVES],
    imports: [FormsModule]
})
export class SearchViewModule { }

