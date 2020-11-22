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
    extractValueToValidate: undefined | ((value: any) => string)
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
    extractValueToValidate
) => void;

export type populateDetailDelegate = (
    e: ICustomEventDelegate,
    value: any,
    detailModes: DetailMode[],
    detailMode: DetailMode,
    validation: IValidationProps,
    props: any,
    restrict?: boolean,
) => (IDetail | null);
