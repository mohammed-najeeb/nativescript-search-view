import { Font } from "tns-core-modules/ui/styling/font";
import { Image } from "tns-core-modules/ui/image";
import {
    SearchViewBase, Color, colorProperty, backgroundColorProperty, backgroundInternalProperty, fontInternalProperty,
    textProperty, hintProperty, textFieldHintColorProperty, textFieldBackgroundColorProperty, fontSizeProperty,
    borderColorProperty, borderWidthProperty, cornerRadiusProperty, searchFieldCursorColorProperty, searchFieldTextColorProperty,
    searchFieldBackgroundColorProperty, placeholderColorProperty, placeholderFontProperty,
    searchBarIconProperty, clearIconProperty, cancelButtonTextProperty, cancelButtonTextFontProperty, cancelButtonTextColorProperty
} from "./search-view.common";
import { ad, layout as LUTILS } from "tns-core-modules/utils/utils";
import { ImageSource } from "tns-core-modules/image-source/image-source";

export * from "./search-view.common";

const SEARCHTEXT = Symbol("searchText");
const QUERY = Symbol("query");

interface QueryTextListener {
    new (owner: SearchView): android.support.v7.widget.SearchView.OnQueryTextListener;
}

interface CloseListener {
    new (owner: SearchView): android.support.v7.widget.SearchView.OnCloseListener;
}

let QueryTextListener: QueryTextListener;
let CloseListener: CloseListener;

function initializeNativeClasses(): void {
    if (QueryTextListener) {
        return;
    }

    @Interfaces([android.support.v7.widget.SearchView.OnQueryTextListener])
    class XSSCompatQueryTextListenerImpl extends java.lang.Object implements android.support.v7.widget.SearchView.OnQueryTextListener {
        constructor(private owner: SearchView) {
            super();
            return global.__native(this);
        }

        onQueryTextChange(newText: string): boolean {
            const owner = this.owner;
            textProperty.nativeValueChange(owner, newText);

            // This code is needed since sometimes OnCloseListener is not called!
            if (newText === "" && this[SEARCHTEXT] !== newText) {
                owner._emit(SearchViewBase.clearEvent);
            }

            this[SEARCHTEXT] = newText;
            this[QUERY] = undefined;
            return true;
        }

        onQueryTextSubmit(query: string): boolean {
            const owner = this.owner;
            // This code is needed since onQueryTextSubmit is called twice with same query!
            //  && this[QUERY] !== query
            if (query !== "") {
                owner._emit(SearchViewBase.submitEvent);
            }

            this[QUERY] = query;
            return true;
        }
    }

    @Interfaces([android.support.v7.widget.SearchView.OnCloseListener])
    class XSSCompatCloseListenerImpl extends java.lang.Object implements android.support.v7.widget.SearchView.OnCloseListener {
        constructor(private owner: SearchView) {
            super();
            return global.__native(this);
        }

        onClose(): boolean {
            this.owner._emit(SearchViewBase.btnClickEvent);
            return true;
        }
    }

    QueryTextListener = XSSCompatQueryTextListenerImpl;
    CloseListener = XSSCompatCloseListenerImpl;
}

// export class XSSTextField extends android.widget.EditText {

//     clearDrawable: android.graphics.drawable.Drawable;
//     searchDrawable: android.graphics.drawable.Drawable;
//     textChangeListener: android.support.v7.widget.SearchView.OnQueryTextListener;

//     constructor(context: android.content.Context) {
//         super(context);
//         return global.__native(this);
//     }
//     static class: java.lang.Class<XSSTextField>;
//     initInst() {
//         // this.setCompoundDrawables(this.searchDrawable, null, null, null);
//         this.setCompoundDrawablesWithIntrinsicBounds(this.searchDrawable, null,
//             null, null);
//         const tf = this;
//         this.addTextChangedListener(new android.text.TextWatcher({
//             beforeTextChanged(s: string, start: number, count: number, after: number): void {

//             },
//             onTextChanged(s: string, start: number, before: number, count: number): void {
//                 tf.updateIcon();
//                 if (tf.textChangeListener) {
//                     tf.textChangeListener.onQueryTextChange(s);
//                 }
//             },
//             afterTextChanged(s: any): void {

//             }
//         }));
//     }

//     // protected onTextChanged(text, start, lengthBefore, lengthAfter) {
//     //     super.onTextChanged(text, start, lengthBefore, lengthAfter);
//     //     this.setClearIconVisible(this.hasFocus() && text.length() > 0);
//     // }

//     // sendAfterTextChanged(text) {
//     //     super.sendAfterTextChanged(text);
//     //     this.setClearIconVisible(this.hasFocus() && text.length() > 0);
//     // }
//     updateIcon() {
//         this.setClearIconVisible(this.hasFocus() && this.getText().length() > 0);
//     }

//     setClearIconVisible(visible: boolean) {
//         this.setCompoundDrawables(this.searchDrawable, null,
//         visible ? this.clearDrawable : null, null);
//     }

//     onTouchEvent(event): boolean {
//         if (event.getAction() === 1) {
//             const drawable = this.clearDrawable;
//             if (drawable != null && event.getX() <= (this.getWidth() - this.getPaddingRight())
//                     && event.getX() >= (this.getWidth() - this.getPaddingRight() - drawable.getBounds().width())) {
//                 this.setText("");
//             }
//         }
//         return super.onTouchEvent(event);
//     }

//     setTextChangeListener(listener: android.support.v7.widget.SearchView.OnQueryTextListener) {
//         this.textChangeListener = listener;
//     }
// }

// export class XSSSearchView extends android.widget.LinearLayout {
//     context: android.content.Context;
//     searchBlock: android.widget.LinearLayout;
//     searchField: XSSTextField;
//     searchButton: android.widget.Button;
//     borderColor: number = android.graphics.Color.BLACK;
//     borderWidth: number = 1.0;
//     cornerRadius: number = 2.0;
//     fontSize: number = 18;
//     searchFieldCursorColor: number = android.graphics.Color.BLACK;
//     searchFieldTextColor: number = android.graphics.Color.BLACK;
//     searchFieldBackgroundColor: number = android.graphics.Color.WHITE;
//     placeholderColor: number = android.graphics.Color.parseColor("#CCCCCC");
//     placeholderFont: Font;
//     searchBarIcon: Image;
//     cancelButtonText: string = "";
//     cancelButtonTextFont: Font;
//     cancelButtonTextColor: number = android.graphics.Color.BLUE;
//     searchListener: android.support.v7.widget.SearchView.OnQueryTextListener;
//     closeListener: android.support.v7.widget.SearchView.OnCloseListener;

//     constructor(context: android.content.Context) {
//         super(context);
//         this.context = context;
//         return global.__native(this);
//     }

//     updateBackground() {
//         const background = new android.graphics.drawable.GradientDrawable();
//         background.setShape(android.graphics.drawable.GradientDrawable.RECTANGLE);
//         background.setCornerRadius(this.cornerRadius);
//         background.setColor(this.searchFieldBackgroundColor);
//         background.setStroke(this.borderWidth, this.borderColor);
//         this.searchField.setPadding(this.borderWidth, this.borderWidth, this.borderWidth, this.borderWidth);
//         this.searchField.setBackground(background);
//     }

//     updateHintTextColor() {
//         this.searchField.setHintTextColor(this.placeholderColor);
//     }

//     updateCursorColor() {
//         const field = android.widget.TextView.class.getDeclaredField("mCursorDrawableRes");
//         field.setAccessible(true);
//         const drawableResId = field.getInt(this.searchField);
//         const field2 = android.widget.TextView.class.getDeclaredField("mEditor");
//         field2.setAccessible(true);
//         const editor = field2.get(this.searchField);
//         const drawable = this.searchField.getContext().getResources().getDrawable(drawableResId);
//         drawable.setColorFilter(this.searchFieldCursorColor, android.graphics.PorterDuff.Mode.SRC_IN);
//         const field3 = editor.getClass().getDeclaredField("mCursorDrawable");
//         field3.setAccessible(true);
//         const drawables = new java.util.ArrayList();
//         drawables.add(drawable);
//         drawables.add(drawable);
//         field3.set(editor, drawables.toArray());
//     }

//     updateTextColor() {
//         this.searchField.setTextColor(this.searchFieldTextColor);
//     }

//     loadDrawable(base64Str: string, width, height): android.graphics.drawable.Drawable {
//         const decodedString = android.util.Base64.decode(CLEAR_BASE64, android.util.Base64.DEFAULT);
//         const bitmap = android.graphics.BitmapFactory.decodeByteArray(decodedString, 0, decodedString.length);
//         const bitmapScaled = android.graphics.Bitmap.createScaledBitmap(bitmap, width, height, true);
//         return new android.graphics.drawable.BitmapDrawable(bitmapScaled);
//     }

//     onMeasure(widthMeasureSpec: number, heightMeasureSpec: number): void {
//         super.onMeasure(widthMeasureSpec, heightMeasureSpec);
//         if (this.searchField.searchDrawable == null) {
//             this.searchField.searchDrawable = this.loadDrawable(SEARCH_BASE64, this.getMeasuredHeight(), this.getMeasuredHeight());
//             this.searchField.setClearIconVisible(true);
//         }
//         if (this.searchField.clearDrawable == null) {
//             this.searchField.clearDrawable = this.loadDrawable(CLEAR_BASE64, this.getMeasuredHeight(), this.getMeasuredHeight());
//             this.searchField.setClearIconVisible(true);
//         }
//     }

//     initInst() {
//         const layoutParam = new android.widget.LinearLayout.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT,
//             android.view.ViewGroup.LayoutParams.MATCH_PARENT);
//         this.setLayoutParams(layoutParam);
//         this.setFocusableInTouchMode(true);
//         this.setOrientation(android.widget.LinearLayout.VERTICAL);
//         this.searchBlock = new android.widget.LinearLayout(this.context);
//         const layoutParamSearch = new android.widget.LinearLayout.LayoutParams(android.view.ViewGroup.LayoutParams.MATCH_PARENT,
//             android.view.ViewGroup.LayoutParams.MATCH_PARENT);
//         this.searchBlock.setLayoutParams(layoutParamSearch);
//         this.searchBlock.setOrientation(android.widget.LinearLayout.HORIZONTAL);
//         this.searchBlock.setPadding(10, 10, 10, 10);
//         this.searchBlock.setBackgroundColor(android.graphics.Color.TRANSPARENT);
//         this.addView(this.searchBlock);

//         this.searchField = new XSSTextField(this.context);
//         this.searchField.setGravity(android.view.Gravity.START | android.view.Gravity.CENTER_VERTICAL);
//         // android.util.Base64.decode(SEARCH_BASE64, android.util.Base64.DEFAULT);
//         // const o: android.graphics.BitmapFactory.Options = new android.graphics.BitmapFactory.Options();
//         // o.inTargetDensity = android.util.DisplayMetrics.DENSITY_DEFAULT;
//         // this.searchField.getMeasuredHeight
//         // android.graphics.BitmapFactory.decodeByteArray();
//         // this.searchField.searchDrawable.getIntrinsicWidth();
//         this.searchField.setCompoundDrawablePadding(8);
//         // const res: android.content.res.Resources = this.getResources();
//         // const resId = res.getIdentifier("search.png", "drawable", this.context.getPackageName());
//         // this.searchField.searchDrawable = res.getDrawable(android.R.);
//         // const image1: ImageSource = new ImageSource();
//         // image1.loadFromFile("~/images/search.png");

//         // // const bitmap1: android.graphics.Bitmap = image1.android;
//         // const bitmap1: android.graphics.Bitmap = android.graphics.BitmapFactory.decodeFile("images/search.png");
//         // this.searchField.searchDrawable  = new android.graphics.drawable.BitmapDrawable(bitmap1);
//         // const image2: ImageSource = new ImageSource();
//         // image2.loadFromFile("~/images/clear.png");
//         // const bitmap2: android.graphics.Bitmap = image2.android;
//         // this.searchField.clearDrawable  = new android.graphics.drawable.BitmapDrawable(bitmap2);

//         this.searchField.initInst();
//         const layoutParamSearchField = new android.widget.LinearLayout.LayoutParams(0,
//             android.view.ViewGroup.LayoutParams.FILL_PARENT, 264);
//         this.searchField.setLayoutParams(layoutParamSearchField);
//         this.searchField.setTextSize(this.fontSize);
//         this.searchField.setTextColor(this.searchFieldTextColor);
//         // this.searchField.setHint(this);
//         this.searchField.setImeOptions(android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH);
//         this.searchField.setBackgroundColor(android.graphics.Color.TRANSPARENT);
//         // this.searchField.setInputType(android.view.inputmethod.EditorInfo.TYPE_CLASS_TEXT);
//         this.searchField.setSingleLine(true);
//         const sv = this;
//         this.searchField.setOnEditorActionListener(new android.widget.TextView.OnEditorActionListener({
//             onEditorAction(v: android.widget.TextView, actionId: number, event): boolean {
//                 if (actionId === android.view.inputmethod.EditorInfo.IME_ACTION_SEARCH
//                     || event.getAction() === android.view.KeyEvent.ACTION_DOWN) {
//                         if (sv.searchListener) {
//                             sv.searchListener.onQueryTextSubmit(v.getText());
//                         }
//                     android.widget.Toast.makeText(v.getContext(), "searching " + v.getText(),
//                         android.widget.Toast.LENGTH_SHORT).show();
//                     return true;
//                 }
//                 return false;
//             }
//         }));
//         this.searchBlock.addView(this.searchField);

//         this.searchButton = new android.widget.Button(this.context);
//         this.searchButton.setText("Search");
//         this.searchButton.setTextSize(this.searchField.getTextSize());
//         this.searchButton.setBackgroundColor(android.graphics.Color.TRANSPARENT);
//         this.searchButton.setAllCaps(false);
//         this.searchBlock.addView(this.searchButton);
//         this.searchButton.setOnClickListener(new android.view.View.OnClickListener({
//             onClick(view: android.view.View) {
//                 if (sv.closeListener != null) {
//                     sv.closeListener.onClose();
//                 }
//             }
//         }));

//         // const imageView = new android.widget.ImageView(this.context);
//         // const layoutParamImageView = new android.widget.LinearLayout.LayoutParams(30, 30);
//         // imageView.setLayoutParams(layoutParamImageView);
//         // imageView.setImageDrawable(this.searchField.searchDrawable);
//         // imageView.setBackgroundColor(android.graphics.Color.GREEN);
//         // this.searchBlock.addView(imageView);
//     }

//     setOnQueryTextListener(listener: android.support.v7.widget.SearchView.OnQueryTextListener) {
//         this.searchListener = listener;
//         this.searchField.setTextChangeListener(listener);
//     }

//     setOnCloseListener(listener: android.support.v7.widget.SearchView.OnCloseListener) {
//         this.closeListener = listener;
//     }

// }

export class SearchView extends SearchViewBase {
    nativeViewProtected: any;
    private _searchTextView: android.widget.TextView;
    private _searchPlate: android.widget.LinearLayout;
    private closeListener: android.support.v7.widget.SearchView.OnCloseListener;
    private queryTextListener: android.support.v7.widget.SearchView.OnQueryTextListener;

    public dismissSoftInput() {
        ad.dismissSoftInput(this.nativeViewProtected);
    }

    public focus(): boolean {
        let result = super.focus();
        if (result) {
            ad.showSoftInput(this.nativeViewProtected);
        }

        return result;
    }

    public createNativeView() {
        initializeNativeClasses();
        // const nativeView = new scut.carson_ho.searchview.SearchView(this._context, null);
        // console.log("this._context=" + this._context);
        const nativeView = new com.xushsh.searchview.XSSSearchView(this._context);
        // nativeView.setIconified(false);

        this.queryTextListener = new QueryTextListener(this);
        nativeView.setOnQueryTextListener(this.queryTextListener);

        this.closeListener = new CloseListener(this);
        nativeView.setOnCloseListener(this.closeListener);

        return nativeView;
    }

    public initNativeView(): void {
        super.initNativeView();
        const nativeView: any = this.nativeViewProtected;
        // this.closeListener).owner = this;
        // this.queryTextListener.owner = this;
    }

    public disposeNativeView() {
        const nativeView: any = this.nativeViewProtected;
        // nativeView.closeListener.owner = null;
        // nativeView.queryTextListener.owner = null;
        this._searchPlate = null;
        this._searchTextView = null;
        super.disposeNativeView();
    }

    [backgroundColorProperty.getDefault](): number {
        // TODO: Why do we get DrawingCacheBackgroundColor but set backgroundColor?????
        const result = this.nativeViewProtected.getDrawingCacheBackgroundColor();
        return result;
    }
    [backgroundColorProperty.setNative](value: Color) {
        let color: number;
        if (typeof value === "number") {
            color = value;
        } else {
            color = value.android;
        }

        this.nativeViewProtected.setBackgroundColor(color);
        const searchPlate = this._getSearchPlate();
        searchPlate.setBackgroundColor(color);
    }

    [colorProperty.getDefault](): number {
        const textView = this._getTextView();
        return textView.getCurrentTextColor();
    }
    [colorProperty.setNative](value: Color) {
        const color: number = (typeof value === "number") ? value : value.android;
        const textView = this._getTextView();
        textView.setTextColor(color);
    }

    [fontSizeProperty.getDefault](): { nativeSize: number } {
        return { nativeSize: this._getTextView().getTextSize() };
    }
    [fontSizeProperty.setNative](value: number | { nativeSize: number }) {
        if (typeof value === "number") {
            this._getTextView().setTextSize(value);
        } else {
            this._getTextView().setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, value.nativeSize);
        }
    }

    [fontInternalProperty.getDefault](): android.graphics.Typeface {
        return this._getTextView().getTypeface();
    }
    [fontInternalProperty.setNative](value: Font | android.graphics.Typeface) {
        this._getTextView().setTypeface(value instanceof Font ? value.getAndroidTypeface() : value);
    }

    [backgroundInternalProperty.getDefault](): any {
        return null;
    }
    [backgroundInternalProperty.setNative](value: any) {
        //
    }

    [textProperty.getDefault](): string {
        return "";
    }
    [textProperty.setNative](value: string) {
        const text = (value === null || value === undefined) ? '' : value.toString();
        this.nativeViewProtected.searchField.setText(text);
    }
    [hintProperty.getDefault](): string {
        return null;
    }
    [hintProperty.setNative](value: string) {
        if (value === null || value === undefined) {
            this.nativeViewProtected.searchField.setHint(null);
        } else {
            this.nativeViewProtected.searchField.setHint(value.toString());
        }
    }
    [textFieldBackgroundColorProperty.getDefault](): android.graphics.drawable.Drawable {
        const textView = this._getTextView();
        return textView.getBackground();
    }
    [textFieldBackgroundColorProperty.setNative](value: Color) {
        const textView = this._getTextView();
        if (value instanceof Color) {
            textView.setBackgroundColor(value.android);
        } else {
            org.nativescript.widgets.ViewHelper.setBackground(textView, value);
        }
    }
    [textFieldHintColorProperty.getDefault](): number {
        const textView = this._getTextView();
        return textView.getCurrentTextColor();
    }
    [textFieldHintColorProperty.setNative](value: Color) {
        const textView = this._getTextView();
        const color = value instanceof Color ? value.android : value;
        textView.setHintTextColor(color);
    }

    private _getTextView(): android.widget.TextView {
        // if (!this._searchTextView) {
        //     const pkgName = this.nativeViewProtected.getContext().getPackageName();
        //     const id = this.nativeViewProtected.getContext().getResources().getIdentifier("search_src_text", "id", pkgName);
        //     this._searchTextView = <android.widget.TextView>this.nativeViewProtected.findViewById(id);
        // }

        // return this._searchTextView;
        return this.nativeViewProtected.searchField;
    }

    private _getSearchPlate(): android.widget.LinearLayout {
        // if (!this._searchPlate) {
        //     const pkgName = this.nativeViewProtected.getContext().getPackageName();
        //     const id = this.nativeViewProtected.getContext().getResources().getIdentifier("search_plate", "id", pkgName);
        //     this._searchPlate = <android.widget.LinearLayout>this.nativeViewProtected.findViewById(id);
        // }

        // return this._searchPlate;
        return this.nativeViewProtected;
    }

    [borderColorProperty.getDefault](): number {
        return this.nativeViewProtected.borderColor;
    }
    [borderColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.borderColor = color;
        this.nativeViewProtected.updateBackground();
    }
    [borderWidthProperty.getDefault](): number {
        return this.nativeViewProtected.borderWidth;
    }
    [borderWidthProperty.setNative](value: number) {
        this.nativeViewProtected.borderWidth = LUTILS.toDevicePixels(value);
        this.nativeViewProtected.updateBackground();
    }
    [cornerRadiusProperty.getDefault](): number {
        return this.nativeViewProtected.cornerRadius;
    }
    [cornerRadiusProperty.setNative](value: number) {
        this.nativeViewProtected.cornerRadius = LUTILS.toDevicePixels(value);
        this.nativeViewProtected.updateBackground();
    }
    [searchFieldCursorColorProperty.getDefault](): number {
        return this.nativeViewProtected.searchFieldCursorColor;
    }
    [searchFieldCursorColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.searchFieldCursorColor = color;
        this.nativeViewProtected.updateCursorColor();
    }
    [searchFieldTextColorProperty.getDefault](): number {
        return this.nativeViewProtected.searchFieldTextColor;
    }
    [searchFieldTextColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.searchFieldTextColor = color;
        this.nativeViewProtected.updateTextColor();
    }
    [searchFieldBackgroundColorProperty.getDefault](): number {
        return this.nativeViewProtected.searchFieldBackgroundColor;
    }
    [searchFieldBackgroundColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.searchFieldBackgroundColor = color;
        this.nativeViewProtected.updateBackground();
    }
    [placeholderColorProperty.getDefault](): number {
        return this.nativeViewProtected.placeholderColor;
    }
    [placeholderColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.placeholderColor = (color);
        this.nativeViewProtected.updateHintTextColor();
    }
    [searchBarIconProperty.getDefault](): any {
        return this.nativeViewProtected.searchBarIcon;
    }
    [searchBarIconProperty.setNative](value: any) {
        this.nativeViewProtected.searchBarIcon = value;
        const imageSource: ImageSource = this.createImageSourceFromSrc(value, true, null);
        if (imageSource != null && imageSource.android != null) {
            this.nativeViewProtected.searchField.setSearchIcon(imageSource.android);
        }
    }
    [clearIconProperty.getDefault](): any {
        return this.nativeViewProtected.searchBarIcon;
    }
    [clearIconProperty.setNative](value: any) {
        this.nativeViewProtected.searchBarIcon = value;
        const imageSource: ImageSource = this.createImageSourceFromSrc(value, true, null);
        if (imageSource != null && imageSource.android != null) {
            this.nativeViewProtected.searchField.setClearIcon(imageSource.android);
        }
    }
    [cancelButtonTextProperty.getDefault](): string {
        return this.nativeViewProtected.searchButton.getText();
    }
    [cancelButtonTextProperty.setNative](value: string) {
        this.nativeViewProtected.searchButton.setText(value);
    }
    [cancelButtonTextColorProperty.getDefault](): number {
        return this.nativeViewProtected.searchButton.getTextColors().getDefaultColor();
    }
    [cancelButtonTextColorProperty.setNative](value: Color) {
        const color = value instanceof Color ? value.android : value;
        this.nativeViewProtected.searchButton.setTextColor(color);
    }
    [cancelButtonTextFontProperty.getDefault](): Font {
        return this.nativeViewProtected.cancelButtonTextFont;
    }
    [cancelButtonTextFontProperty.setNative](value: Font) {
        this.nativeViewProtected.cancelButtonTextFont = value;
        this.nativeViewProtected.searchButton.setTypeface(value.getAndroidTypeface());
    }
    [placeholderFontProperty.getDefault](): Font {
        return this.nativeViewProtected.placeholderFont;
    }
    [placeholderFontProperty.setNative](value: Font) {
        this.nativeViewProtected.placeholderFont = value;
        this.nativeViewProtected.searchField.setTypeface(value.getAndroidTypeface());
    }
}
