import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import {HelloWorldModel} from './main-view-model';
import * as DIALOGS from 'tns-core-modules/ui/dialogs';

// Event handler for Page 'loaded' event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    page.bindingContext = new HelloWorldModel();
}

export function onSubmit(args) {
    console.log("Search for " + args.object.text);
    DIALOGS.alert("Search for " + args.object.text).then();
}

export function onClear(args) {
    console.log("Clear for " + args.object.text);
    DIALOGS.alert("Clear for " + args.object.text).then();
}

export function onBtnClick(args) {
    console.log("Click for " + args.object.text);
    DIALOGS.alert("Click for " + args.object.text).then();
}
