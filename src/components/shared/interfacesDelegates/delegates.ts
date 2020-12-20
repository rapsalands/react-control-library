import { DetailMode } from "../../form/detailMode";
import { IValidationProps } from "./controlnterfaces";
import { IChangeInputEvent, IDetail, IFocusInputEvent, IKeyboardInputEvent, IToValue, IToValueWithCursor } from "./eventInterfaces";

export type ICustomEventDelegate = IChangeInputEvent | IFocusInputEvent | IKeyboardInputEvent;

export type changeDelegate = (
    e: IChangeInputEvent,
    data: any,
    setData: (data: any) => void,
    onChangeCB: (e: IChangeInputEvent) => void,
    validation: IValidationProps,
    detailModes: DetailMode[],
    props,
    extractValueToValidate: undefined | ((value: any) => string),
    extractValueToSet?: (e: IChangeInputEvent, value: string) => IToValue | IToValueWithCursor
) => void;

export type keyPressDelegate = (
    e: IKeyboardInputEvent,
    validation: IValidationProps,
    onKeyPressCB,
    props,
    extractValueToValidate
) => void;

export type blurDelegate = (
    e: IFocusInputEvent,
    data,
    setData,
    onBlurCB,
    validation: IValidationProps,
    detailModes: DetailMode[],
    props,
    extractValueToValidate,
    extractValueToSet?: (e: IFocusInputEvent, value: string) => IToValue | IToValueWithCursor
) => void;

export type validateDelegate = (
    validation: IValidationProps,
    detail: IDetail | null | undefined,
    value: any,
    props: any
) => (IDetail | null);
