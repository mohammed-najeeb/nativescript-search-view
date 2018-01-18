import { Component, AfterViewInit, Directive, ElementRef, Input, HostListener, Inject, NgModule, forwardRef } from "@angular/core";
import { ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { View, unsetValue } from "tns-core-modules/ui/core/view";
import { SearchView } from "../search-view.ios";


const SELECTED_INDEX_VALUE_ACCESSOR = {provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextValueAccessor), multi: true};

export type SelectableView = {text: string} & View;

export class MyBaseValueAccessor<TView extends View> implements ControlValueAccessor {
    private pendingChangeNotification: any = 0;
    onChange = (_) => { };
    onTouched = () => {};

    constructor(public view: TView) { }

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = (arg) => {
            if (this.pendingChangeNotification) {
                clearTimeout(this.pendingChangeNotification);
            }
            this.pendingChangeNotification = setTimeout(() => {
                this.pendingChangeNotification = 0;
                fn(arg);
            }, 20);
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.view.isEnabled = !isDisabled;
    }

    writeValue(_: any) {}

    isBlank(obj: any): boolean {
        return obj === undefined || obj === null;
    }

    protected normalizeValue(value: any): any {
        return this.isBlank(value) ? unsetValue : value;
    }
}
/**
 * The accessor for setting a selectedIndex and listening to changes that is used by the
 * {@link NgModel} directives.
 *
 *  ### Example
 *  ```
 *  <DropDown [(ngModel)]="model.test">
 *  ```
 */
@Directive({
    // tslint:disable-next-line:max-line-length directive-selector
    selector:  "SearchView[ngModel], SearchView[formControlName], searchView[ngModel], searchView[formControlName], search-view[ngModel], search-view[formControlName]",
    providers: [SELECTED_INDEX_VALUE_ACCESSOR]
})
export class TextValueAccessor extends MyBaseValueAccessor<SearchView> implements AfterViewInit { // tslint:disable-line:max-line-length directive-class-suffix

    private _normalizedValue: string;
    private viewInitialized: boolean;

    constructor(@Inject(ElementRef) elementRef: ElementRef) {
        super(elementRef.nativeElement);
    }

    @HostListener("textChange", ["$event"])
    public textChangeListener(event: any) {
        this.onChange(event.value);
    }

    // tslint:disable-next-line:no-empty
    public onTouched = () => { };

    public writeValue(value: any): void {
        if (value === undefined || value === null ||  value === "") {
            this._normalizedValue = null;
        }
        else {
            this._normalizedValue = value;
        }

        if (this.viewInitialized) {
            this.view.text = this._normalizedValue == null ? "" : this._normalizedValue;
        }
    }

    public ngAfterViewInit() {
        this.viewInitialized = true;
        this.view.text = this._normalizedValue == null ? "" : this._normalizedValue;
    }

    public registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}

export const DIRECTIVES = TextValueAccessor;