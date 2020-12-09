import { DetailMode } from "../../form/detailMode";
import { IValidationProps } from "./controlnterfaces";
import { IChangeInputEvent, IDetail, IFocusInputEvent, IKeyboardInputEvent } from "./eventInterfaces";

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
    extractValueToSet?: (value: string) => string
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
    extractValueToSet?: (value: string) => string
) => void;

export type validateDelegate = (
    validation: IValidationProps,
    detail: IDetail | null | undefined,
    value: any,
    props: any
) => (IDetail | null);
