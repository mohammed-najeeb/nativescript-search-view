import { Component } from "@angular/core";
import * as DIALOGS from 'tns-core-modules/ui/dialogs';

@Component({
  selector: "my-app",
  template: `
    <ActionBar title="My App" class="action-bar"></ActionBar>
    <StackLayout>
    <SearchView hint="Input keyword" (clear)="onClear()" (submit)="onSubmit()"
      (btnClick)="onBtnClick()" [(ngModel)]="searchText"
      cancelButtonText="Search"
      searchBarIcon="~/images/search.png"
      clearIcon="~/images/clear.png"
      style="corner-radius:2.0;border-width:1;border-color:#FF0000;search-field-cursor-color:#FFFF00;search-field-text-color:#FFFF00;
    search-field-background-color:green;placeholder-color:#FFFF00;cancel-button-text-color:blue;" ></SearchView>
    <SearchView  hint="Input keyword" (clear)="onClear()" (submit)="onSubmit()"
    (btnClick)="onBtnClick()" [(ngModel)]="searchText"
     style="corner-radius:2.0;border-width:1;border-color:#CCCCCC;" ></SearchView>
      </StackLayout>
  `
})
export class AppComponent {
  // Your TypeScript logic goes here
  searchText: string = "";
  onSubmit() {
      console.log("Search for " + this.searchText);
      DIALOGS.alert("Search for " + this.searchText).then();
  }

  onClear() {
      console.log("Clear for " + this.searchText);
      DIALOGS.alert("Clear for " + this.searchText).then();
  }

  onBtnClick() {
      console.log("Click for " + this.searchText);
      DIALOGS.alert("Click for " + this.searchText).then();
  }
}
