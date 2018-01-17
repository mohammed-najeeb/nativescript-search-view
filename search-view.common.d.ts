import { SearchView as SearchViewDefinition } from ".";
import { View, Property, Color, InheritedCssProperty, Style } from "tns-core-modules/ui/core/view";
import { Font } from "tns-core-modules/ui/styling/font";
import { ImageSource } from "tns-core-modules/image-source/image-source";
import { ImageAsset } from "tns-core-modules/image-asset";
export * from "tns-core-modules/ui/core/view";
export declare abstract class SearchViewBase extends View implements SearchViewDefinition {
    static submitEvent: string;
    static clearEvent: string;
    static btnClickEvent: string;
    text: string;
    hint: string;
    textFieldBackgroundColor: Color;
    textFieldHintColor: Color;
    abstract dismissSoftInput(): any;
    _emit(eventNames: string): void;
    createImageSourceFromSrc(value: string | ImageSource | ImageAsset, sync: boolean, imageLoaded: (source) => any): ImageSource;
}
export declare const textProperty: Property<SearchViewBase, string>;
export declare const hintProperty: Property<SearchViewBase, string>;
export declare const textFieldHintColorProperty: Property<SearchViewBase, Color>;
export declare const textFieldBackgroundColorProperty: Property<SearchViewBase, Color>;
export declare const borderColorProperty: InheritedCssProperty<Style, Color>;
export declare const borderWidthProperty: InheritedCssProperty<Style, number>;
export declare const cornerRadiusProperty: InheritedCssProperty<Style, number>;
export declare const searchFieldTextColorProperty: InheritedCssProperty<Style, Color>;
export declare const searchFieldCursorColorProperty: InheritedCssProperty<Style, Color>;
export declare const searchFieldBackgroundColorProperty: InheritedCssProperty<Style, Color>;
export declare const placeholderColorProperty: InheritedCssProperty<Style, Color>;
export declare const placeholderFontProperty: InheritedCssProperty<Style, Font>;
export declare const searchBarIconProperty: Property<SearchViewBase, any>;
export declare const clearIconProperty: Property<SearchViewBase, any>;
export declare const cancelButtonTextProperty: Property<SearchViewBase, string>;
export declare const cancelButtonTextFontProperty: InheritedCssProperty<Style, Font>;
export declare const cancelButtonTextColorProperty: InheritedCssProperty<Style, Color>;
