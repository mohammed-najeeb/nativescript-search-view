import { AfterViewInit, ElementRef } from "@angular/core";
import { ControlValueAccessor } from "@angular/forms";
import { View } from "tns-core-modules/ui/core/view";
import { SearchView } from "../search-view.ios";
export declare type SelectableView = {
    text: string;
} & View;
export declare class MyBaseValueAccessor<TView extends View> implements ControlValueAccessor {
    view: TView;
    private pendingChangeNotification;
    onChange: (_: any) => void;
    onTouched: () => void;
    constructor(view: TView);
    registerOnChange(fn: (_: any) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    writeValue(_: any): void;
    isBlank(obj: any): boolean;
    protected normalizeValue(value: any): any;
}
export declare class TextValueAccessor extends MyBaseValueAccessor<SearchView> implements AfterViewInit {
    private _normalizedValue;
    private viewInitialized;
    constructor(elementRef: ElementRef);
    textChangeListener(event: any): void;
    onTouched: () => void;
    writeValue(value: any): void;
    ngAfterViewInit(): void;
    registerOnTouched(fn: () => void): void;
}
export declare const DIRECTIVES: typeof TextValueAccessor;
