import { ChangeEvent, FocusEvent, KeyboardEvent } from "react";

export interface InputHTMLEvent {
    detail: IDetail | null,
    target: HTMLInputElement
}

export interface IChangeEvent<T> extends ChangeEvent<T> {
    detail: IDetail | null,
}

export interface IChangeInputEvent extends IChangeEvent<HTMLInputElement> {
}

export interface IFocusEvent<T> extends FocusEvent<T> {
    detail: IDetail | null,
}

export interface IFocusInputEvent extends IFocusEvent<HTMLInputElement> {
}

export interface IKeyboardEvent<T> extends KeyboardEvent<T> {
    detail: IDetail | null,
}

export interface IKeyboardInputEvent extends IKeyboardEvent<HTMLInputElement> {
}

export interface IDetail {
    detail: any,
    value: any,
    isValid: boolean,
    attribute: string | null,
    metadata?: any[]
}
