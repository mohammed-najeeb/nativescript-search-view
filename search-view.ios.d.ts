import { SearchViewBase } from "./search-view.common";
export * from "./search-view.common";
export declare class XSSUISearchBar extends UISearchBar {
    tf: UITextField;
    cb: UIButton;
    ph: UILabel;
    static new(): XSSUISearchBar;
    setCornerRadius(cornerRadius: number): void;
    setBorderColor(borderColor: UIColor): void;
    setBorderWidth(borderWidth: number): void;
    setSearchFieldTineColor(searchFieldTineColor: UIColor): void;
    setSearchFieldBackgroundColor(searchFieldBackgroundColor: UIColor): void;
    setPlaceholderColor(placeholderColor: UIColor): void;
    setPlaceholderFont(placeholderFont: UIFont): void;
    setSearchBarIcon(searchBarIcon: UIImage): void;
    setClearIcon(clearIcon: UIImage): void;
    setCancelButtonText(cancelButtonText: string): void;
    setCancelButtonTextFont(cancelButtonTextFont: UIFont): void;
    setCancelButtonTextColor(cancelButtonTextColor: UIColor): void;
    willMoveToWindow(newWindow: UIWindow): void;
}
export declare class SearchView extends SearchViewBase {
    private _ios;
    private _delegate;
    private __textField;
    private __placeholderLabel;
    constructor();
    onLoaded(): void;
    onUnloaded(): void;
    dismissSoftInput(): void;
    readonly ios: XSSUISearchBar;
    readonly _textField: UITextField;
    readonly _placeholderLabel: UILabel;
}
