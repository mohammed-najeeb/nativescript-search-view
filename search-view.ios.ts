import { Font } from "tns-core-modules/ui/styling/font";
import { Image } from "tns-core-modules/ui/image";
import {
    SearchViewBase, Color, colorProperty, backgroundColorProperty, backgroundInternalProperty, fontInternalProperty,
    textProperty, hintProperty, textFieldHintColorProperty, textFieldBackgroundColorProperty,
    borderColorProperty, borderWidthProperty, cornerRadiusProperty, searchFieldCursorColorProperty, searchFieldTextColorProperty,
    searchFieldBackgroundColorProperty, placeholderColorProperty, placeholderFontProperty,
    searchBarIconProperty, clearIconProperty, cancelButtonTextProperty, cancelButtonTextFontProperty, cancelButtonTextColorProperty
} from "./search-view.common";

export * from "./search-view.common";

export class XSSUISearchBar extends UISearchBar {

    tf: UITextField;
    cb: UIButton;
    ph: UILabel;

    static new(): XSSUISearchBar {
        const self = <XSSUISearchBar>super.new();
        self.showsCancelButton = true;
        self.tf = self.valueForKey("searchField");
        self.placeholder = "Touch to type in";
        self.ph = self.tf.valueForKey("placeholderLabel");
        self.cb = self.valueForKey("cancelButton");
        self.backgroundImage = UIImage.alloc().init();
        self.barTintColor = UIColor.clearColor;
        self.searchBarStyle = UISearchBarStyle.Default;
        // if (!self.cb) {
        //     let e = self.subviews.lastObject.subviews.objectEnumerator();
        //     let subView: UIView = null;
        //     while (subView = e.nextObject()) {
        //         if (subView.isKindOfClass(UIButton.class())) {
        //             self.cb = <UIButton>subView;
        //             break;
        //         }
        //     }
        // }
        return self;
    }
    public setCornerRadius(cornerRadius: number) {
        // const tf: UITextField = this.valueForKey("searchField");
        this.tf.layer.cornerRadius = cornerRadius;
        this.tf.layer.masksToBounds = true;
    }

    public setBorderColor(borderColor: UIColor) {
        // const tf: UITextField = this.valueForKey("searchField");
        this.tf.layer.borderColor = borderColor.CGColor;
    }

    public setBorderWidth(borderWidth: number) {
        // const tf: UITextField = this.valueForKey("searchField");
        this.tf.layer.borderWidth = borderWidth;
    }

    public setSearchFieldTineColor(searchFieldTineColor: UIColor) {
        this.tintColor = searchFieldTineColor;
    }

    public setSearchFieldBackgroundColor(searchFieldBackgroundColor: UIColor) {
        // const tf: UITextField = this.valueForKey("searchField");
        this.tf.backgroundColor = UIColor.clearColor;
        this.tf.layer.backgroundColor = searchFieldBackgroundColor.CGColor;
    }

    public setPlaceholderColor(placeholderColor: UIColor) {
        // const label: UILabel = this.tf.valueForKey("placeholderLabel");
        this.ph.textColor = placeholderColor;
    }

    public setPlaceholderFont(placeholderFont: UIFont) {
        this.ph.font = placeholderFont;
    }

    public setSearchBarIcon(searchBarIcon: UIImage) {
        this.setImageForSearchBarIconState(searchBarIcon, UISearchBarIcon.Search, UIControlState.Normal);
    }

    public setClearIcon(clearIcon: UIImage) {
        this.setImageForSearchBarIconState(clearIcon, UISearchBarIcon.Clear, UIControlState.Normal);
    }

    public setCancelButtonText(cancelButtonText: string) {
        this.cb.setTitleForState(cancelButtonText, UIControlState.Normal);
    }

    public setCancelButtonTextFont(cancelButtonTextFont: UIFont) {
        this.cb.font = cancelButtonTextFont;
    }

    public setCancelButtonTextColor(cancelButtonTextColor: UIColor) {
        this.cb.setTitleColorForState(cancelButtonTextColor, UIControlState.Normal);
        this.cb.setTitleColorForState(cancelButtonTextColor, UIControlState.Highlighted);
    }

    willMoveToWindow(newWindow: UIWindow) {
        // this.tf = this.valueForKey("searchField");
        // this.cb = this.valueForKey("cancelButton");
    }
}

class UISearchViewDelegateImpl extends NSObject implements UISearchBarDelegate {
    public static ObjCProtocols = [UISearchBarDelegate];

    private _owner: WeakRef<SearchView>;

    public static initWithOwner(owner: WeakRef<SearchView>): UISearchViewDelegateImpl {
        let delegate = <UISearchViewDelegateImpl>UISearchViewDelegateImpl.new();
        delegate._owner = owner;
        return delegate;
    }

    public searchBarTextDidChange(SearchView: UISearchBar, searchText: string) {
        let owner = this._owner.get();
        if (!owner) {
            return;
        }

        textProperty.nativeValueChange(owner, searchText);

        // This code is needed since sometimes SearchViewCancelButtonClicked is not called!
        if (searchText === "") {
            owner._emit(SearchViewBase.clearEvent);
        }
    }

    public searchBarCancelButtonClicked(SearchView: UISearchBar) {
        SearchView.resignFirstResponder();
        let owner = this._owner.get();
        if (!owner) {
            return;
        }

        owner._emit(SearchViewBase.btnClickEvent);
    }

    public searchBarSearchButtonClicked(SearchView: UISearchBar) {
        SearchView.resignFirstResponder();
        let owner = this._owner.get();
        if (!owner) {
            return;
        }

        owner._emit(SearchViewBase.submitEvent);
    }
}

export class SearchView extends SearchViewBase {
    private _ios: XSSUISearchBar;
    private _delegate;
    private __textField: UITextField;
    private __placeholderLabel: UILabel;

    constructor() {
        super();

        this.nativeViewProtected = this._ios = XSSUISearchBar.new();
        this._delegate = UISearchViewDelegateImpl.initWithOwner(new WeakRef(this));
    }

    public onLoaded() {
        super.onLoaded();
        this._ios.delegate = this._delegate;
        // this._ios.setCancelButtonText("Search");
        // this._ios.setShowsCancelButtonAnimated(true, false);
        // this._ios.setBorderColor(UIColor.redColor);
        // this._ios.setCornerRadius(4.0);
        // this._ios.setSearchFieldBackgroundColor(UIColor.whiteColor);
        // this._ios.setCancelButtonTextColor(UIColor.blueColor);
        // this._ios.cb.titleLabel.font = UIFont.systemFontOfSize(18);
        // this._ios.placeholder = ("placeholder");
        // this._ios.setBorderWidth(2);
        // const  buttonFrame: CGRect = this._ios.cb.frame;
        // buttonFrame.size = CGSizeMake(150, 70);
        // this._ios.cb.frame = buttonFrame;
        // const  tfFrame: CGRect = this._ios.tf.frame;
        // tfFrame.size = CGSizeMake(150, 70);
        // this._ios.tf.frame = tfFrame;
    }

    public onUnloaded() {
        this._ios.delegate = null;
        super.onUnloaded();
    }

    public dismissSoftInput() {
        (<UIResponder>this.ios).resignFirstResponder();
    }

    get ios(): XSSUISearchBar {
        return this._ios;
    }

    get _textField(): UITextField {
        if (!this.__textField) {
            this.__textField = this.ios.valueForKey("searchField");
        }

        return this.__textField;
    }

    get _placeholderLabel(): UILabel {
        if (!this.__placeholderLabel) {
            if (this._textField) {
                this.__placeholderLabel = this._textField.valueForKey("placeholderLabel");
            }
        }

        return this.__placeholderLabel;
    }

    [backgroundColorProperty.getDefault](): UIColor {
        return this._ios.barTintColor;
    }
    [backgroundColorProperty.setNative](value: UIColor | Color) {
        let color: UIColor = value instanceof Color ? value.ios : value;
        this._ios.barTintColor = color;
    }

    [colorProperty.getDefault](): UIColor {
        let sf = this._textField;
        if (sf) {
            return sf.textColor;
        }
        return null;
    }
    [colorProperty.setNative](value: UIColor | Color) {
        let sf = this._textField;
        let color = value instanceof Color ? value.ios : value;
        if (sf) {
            sf.textColor = color;
            sf.tintColor = color;
        }
    }

    [fontInternalProperty.getDefault](): UIFont {
        let sf = this._textField;
        return sf ? sf.font : null;
    }
    [fontInternalProperty.setNative](value: UIFont | Font) {
        let sf = this._textField;
        if (sf) {
            sf.font = value instanceof Font ? value.getUIFont(sf.font) : value;
        }
    }

    [backgroundInternalProperty.getDefault](): any {
        return null;
    }
    [backgroundInternalProperty.setNative](value: any) {
        //
    }

    [textProperty.getDefault](): string {
        return '';
    }
    [textProperty.setNative](value: string) {
        const text = (value === null || value === undefined) ? '' : value.toString();
        this._ios.text = text;
    }

    [hintProperty.getDefault](): string {
        return '';
    }
    [hintProperty.setNative](value: string) {
        const text = (value === null || value === undefined) ? '' : value.toString();
        this._ios.placeholder = text;
    }

    [textFieldBackgroundColorProperty.getDefault](): UIColor {
        const textField = this._textField;
        if (textField) {
            return textField.backgroundColor;
        }

        return null;
    }
    [textFieldBackgroundColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        const textField = this._textField;
        if (textField) {
            textField.backgroundColor = color;
        }
    }

    [textFieldHintColorProperty.getDefault](): UIColor {
        const placeholderLabel = this._placeholderLabel;
        if (placeholderLabel) {
            return placeholderLabel.textColor;
        }

        return null;
    }
    [textFieldHintColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        const placeholderLabel = this._placeholderLabel;
        if (placeholderLabel) {
            placeholderLabel.textColor = color;
        }
    }
    [borderColorProperty.getDefault](): UIColor {
        return this._ios.tf.layer.borderColor;
    }
    [borderColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.setBorderColor(color);
    }
    [borderWidthProperty.getDefault](): number {
        return this._ios.tf.layer.borderWidth;
    }
    [borderWidthProperty.setNative](value: number) {
        this._ios.setBorderWidth(value);
    }
    [cornerRadiusProperty.getDefault](): number {
        return this._ios.tf.layer.cornerRadius;
    }
    [cornerRadiusProperty.setNative](value: number) {
        this._ios.setCornerRadius(value);
    }
    [searchFieldCursorColorProperty.getDefault](): UIColor {
        return this._ios.tintColor;
    }
    [searchFieldCursorColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.setSearchFieldTineColor(color);
    }
    [searchFieldTextColorProperty.getDefault](): UIColor {
        return this._ios.tf.textColor;
    }
    [searchFieldTextColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.tf.textColor = color;
    }
    [searchFieldBackgroundColorProperty.getDefault](): UIColor {
        return this._ios.tf.layer.backgroundColor;
    }
    [searchFieldBackgroundColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.setSearchFieldBackgroundColor(color);
    }
    [placeholderColorProperty.getDefault](): UIColor {
        return this._placeholderLabel.textColor;
    }
    [placeholderColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.setPlaceholderColor(color);
    }
    [searchBarIconProperty.getDefault](): any {
        return null;
    }
    [searchBarIconProperty.setNative](value: any) {
        const imageSource = this.createImageSourceFromSrc(value, true, null);
        // const image: UIImageView = value.ios;
        this._ios.setSearchBarIcon(imageSource.ios);
    }
    [clearIconProperty.getDefault](): any {
        return null;
    }
    [clearIconProperty.setNative](value: any) {
        const imageSource = this.createImageSourceFromSrc(value, true, null);
        // const image: UIImageView = value.ios;
        this._ios.setClearIcon(imageSource.ios);
    }
    [cancelButtonTextProperty.getDefault](): string {
        return this._ios.cb.titleForState(UIControlState.Normal);
    }
    [cancelButtonTextProperty.setNative](value: string) {
        this._ios.setCancelButtonText(value);
    }
    [cancelButtonTextColorProperty.getDefault](): UIColor {
        // return this._ios.cb.titleLabel.textColor;
        // return UIColor.blueColor;
        return this._ios.cb.titleColorForState(UIControlState.Normal);
    }
    [cancelButtonTextColorProperty.setNative](value: Color | UIColor) {
        const color = value instanceof Color ? value.ios : value;
        this._ios.setCancelButtonTextColor(color);
    }
    [cancelButtonTextFontProperty.getDefault](): Font {
        return Font.default;
    }
    [cancelButtonTextFontProperty.setNative](value: Font) {
        this._ios.setCancelButtonTextFont(value.getUIFont(Font.default));
    }
    [placeholderFontProperty.getDefault](): Font {
        return Font.default;
    }
    [placeholderFontProperty.setNative](value: Font) {
        this._ios.setPlaceholderFont(value.getUIFont(Font.default));
    }
}
