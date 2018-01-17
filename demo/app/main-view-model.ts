import { Observable } from 'tns-core-modules/data/observable';
import { SearchView } from 'nativescript-search-view';
import * as DIALOGS from 'tns-core-modules/ui/dialogs';

export class HelloWorldModel extends Observable {
  public message: string;
  private searchView: SearchView;

  constructor() {
    super();

    // this.searchView = new SearchView();
    this.message = 'searchView example';
  }
}


