import { SearchViewBase } from "./search-view.common";
export * from "./search-view.common";
export declare class SearchView extends SearchViewBase {
    nativeViewProtected: any;
    private _searchTextView;
    private _searchPlate;
    private closeListener;
    private queryTextListener;
    dismissSoftInput(): void;
    focus(): boolean;
    createNativeView(): com.xushsh.searchview.XSSSearchView;
    initNativeView(): void;
    disposeNativeView(): void;
    private _getTextView();
    private _getSearchPlate();
}
