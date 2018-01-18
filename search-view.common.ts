import { SearchView as SearchViewDefinition } from ".";
import { View, Property, Color, isIOS, InheritedCssProperty, Style, fontFamilyProperty } from "tns-core-modules/ui/core/view";
import { Font } from "tns-core-modules/ui/styling/font";
import { Image } from "tns-core-modules/ui/image";
import { ImageSource, fromAsset, fromNativeSource, fromUrl } from "tns-core-modules/image-source/image-source";
import { ImageAsset } from "tns-core-modules/image-asset";
import { isDataURI, isFileOrResourcePath, RESOURCE_PREFIX } from "tns-core-modules/utils/utils";

export * from "tns-core-modules/ui/core/view";

export abstract class SearchViewBase extends View implements SearchViewDefinition {
    public static submitEvent = "submit";
    public static clearEvent = "clear";
    public static btnClickEvent = "btnClick";
    public static textChangedEvent = "textChanged";
    public text: string;
    public hint: string;
    public textFieldBackgroundColor: Color;
    public textFieldHintColor: Color;

    public abstract dismissSoftInput();

    public _emit(eventNames: string) {
      const events = eventNames.split(",");

      for (let i = 0, l = events.length; i < l; i++) {
          const event = events[i].trim();
          this.notify({ eventName: event, object: this });
      }
  }
  public createImageSourceFromSrc(value: string | ImageSource | ImageAsset, sync: boolean, imageLoaded: (source) => any): ImageSource {

        let imageSource: ImageSource = new ImageSource();
        if (typeof value === "string" || value instanceof String) {
            value = value.trim();
            this["_url"] = value;

            if (isDataURI(value)) {
                const base64Data = value.split(",")[1];
                if (base64Data !== undefined) {
                    if (sync) {
                        imageSource.loadFromBase64(base64Data);
                    } else {
                        imageSource.fromBase64(base64Data).then(imageLoaded);
                    }
                }
            } else if (isFileOrResourcePath(value)) {
                if (value.indexOf(RESOURCE_PREFIX) === 0) {
                    const resPath = value.substr(RESOURCE_PREFIX.length);
                    if (sync) {
                        imageSource.loadFromResource(resPath);
                    } else {
                        imageSource.fromResource(resPath).then(imageLoaded);
                    }
                } else {
                    if (sync) {
                        imageSource.loadFromFile(value);
                    } else {
                        imageSource.fromFile(value).then(imageLoaded);
                    }
                }
            } else {
                fromUrl(value).then((r) => {
                    if (this["_url"] === value) {
                        imageSource = r;
                        if (!sync && imageLoaded) {
                            imageLoaded(r);
                        }
                    }
                });
            }
        } else if (value instanceof ImageSource) {
            // Support binding the imageSource trough the src property
            imageSource = value;
        } else if (value instanceof ImageAsset) {
            fromAsset(value).then((result) => {
                imageSource = result;
                if (!sync && imageLoaded) {
                    imageLoaded(result);
                }
            });
        }
        else {
            imageSource = fromNativeSource(value);
            if (!sync && imageLoaded) {
                imageLoaded(imageSource);
            }
        }
        return imageSource;
    }

}

// SearchViewBase.prototype.recycleNativeView = "auto";

export const textProperty = new Property<SearchViewBase, string>({ name: "text", defaultValue: "", affectsLayout: isIOS });
textProperty.register(SearchViewBase);

export const hintProperty = new Property<SearchViewBase, string>({ name: "hint", defaultValue: "" });
hintProperty.register(SearchViewBase);

export const textFieldHintColorProperty = new Property<SearchViewBase, Color>({ name: "textFieldHintColor", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
textFieldHintColorProperty.register(SearchViewBase);

export const textFieldBackgroundColorProperty = new Property<SearchViewBase, Color>({ name: "textFieldBackgroundColor", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
textFieldBackgroundColorProperty.register(SearchViewBase);

export const borderColorProperty = new InheritedCssProperty<Style, Color>({ name: "borderColor", cssName: "border-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
borderColorProperty.register(Style);
export const borderWidthProperty = new InheritedCssProperty<Style, number>({ name: "borderWidth", cssName: "border-width"});
borderWidthProperty.register(Style);
export const cornerRadiusProperty = new InheritedCssProperty<Style, number>({ name: "cornerRadius", cssName: "corner-radius"});
cornerRadiusProperty.register(Style);
export const searchFieldTextColorProperty = new InheritedCssProperty<Style, Color>({ name: "searchFieldTextColor", cssName: "search-field-text-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
searchFieldTextColorProperty.register(Style);
export const searchFieldCursorColorProperty = new InheritedCssProperty<Style, Color>({ name: "searchFieldCursorColor", cssName: "search-field-cursor-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
searchFieldCursorColorProperty.register(Style);
export const searchFieldBackgroundColorProperty = new InheritedCssProperty<Style, Color>({ name: "searchFieldBackgroundColor", cssName: "search-field-background-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
searchFieldBackgroundColorProperty.register(Style);
export const placeholderColorProperty = new InheritedCssProperty<Style, Color>({ name: "placeholderColor", cssName: "placeholder-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
placeholderColorProperty.register(Style);
export const placeholderFontProperty = new InheritedCssProperty<Style, Font>({ name: "placeholderFont", cssName: "placeholder-font", defaultValue: Font.default });
placeholderFontProperty.register(Style);
export const searchBarIconProperty = new Property<SearchViewBase, any>({ name: "searchBarIcon", defaultValue: null });
searchBarIconProperty.register(SearchViewBase);
export const clearIconProperty = new Property<SearchViewBase, any>({ name: "clearIcon", defaultValue: null });
clearIconProperty.register(SearchViewBase);
export const cancelButtonTextProperty = new Property<SearchViewBase, string>({ name: "cancelButtonText", defaultValue: null, affectsLayout: isIOS });
cancelButtonTextProperty.register(SearchViewBase);
export const cancelButtonTextFontProperty = new InheritedCssProperty<Style, Font>({ name: "cancelButtonTextFont", cssName: "cancel-button-text-font", defaultValue: Font.default });
cancelButtonTextFontProperty.register(Style);
export const cancelButtonTextColorProperty = new InheritedCssProperty<Style, Color>({ name: "cancelButtonTextColor", cssName: "cancel-button-text-color", equalityComparer: Color.equals, valueConverter: (v) => new Color(v) });
cancelButtonTextColorProperty.register(Style);