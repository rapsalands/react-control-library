import { DetailMode } from "../../form/detailMode";
import { ValidationType } from "../enumerations";
import { IChangeInputEvent, IDetail, IFocusInputEvent, IToValue, IToValueWithCursor } from "./eventInterfaces";

export interface ICustomInputProps extends React.HTMLProps<HTMLInputElement> {
    exactLength?: number;
    validation?: IValidationProps;
    inputTag?: any;
    detailModes?: DetailMode[],
    setReference?: (refSetter: ((ref: React.MutableRefObject<HTMLInputElement | undefined>) => void)) => void,
    extractValueToValidate?: (value) => any,
    extractValueToSet?: (e: IChangeInputEvent | IFocusInputEvent | null, value: string) => IToValueWithCursor | IToValue,
}

export interface IValidationProps {
    controlSpecific: ((data: any) => IDetail) | null;
    /** Prevent user Inputs once following when validation fails. Defaults to onChange and onKeyPress */
    preventInput: DetailMode[];
    skipValidationTypes: ValidationType[]
}

export interface IDecimalInputProps extends ICustomInputProps {
    decimalLimit?: number
}

export interface IAllowSymbolsProps extends ICustomInputProps {
    allowSymbols?: string;
}

export interface IRestrictSymbolsProps extends ICustomInputProps {
    restrictSymbols?: string;
}

export interface IPasswordProps {
    passwordCriteria?: IPasswordCriteria
}

export interface IPasswordCriteria {
    capital?: number,
    minLength?: number,
    maxLength?: number,
    numberCount?: number,
    symbols?: number,
    restrictSymbols?: string
    sequence?: {
        number?: number,
        characters?: number,
    },
}

export interface IPasswordFailure {
    attribute: string,
    value: any,
    message: string | null,
    metadata: any,
}

export interface INumberMaskProps {
    numberMask: INumberMask
}
export interface INumberMask {
    prefix: string; // what to display before the amount. Defaults to '$'.
    suffix: string; // what to display after the amount. Defaults to empty string.
    // thousandsSeparator: boolean; // whether or not to separate thousands. Defaults to to true.
    thousandsSeparatorSymbol: string; // character with which to separate thousands. Default to ','.
    decimalSymbol: string; // character that will act as a decimal point. Defaults to '.'
    decimalLimit: number; // how many digits to allow after the decimal. Defaults to 2
    maxLength: number; // limit the length of the integer number. Defaults to null for unlimited
    negativeAllowed: boolean; // negative symbol. Defaults to none,
}

export interface IMaskedInputProps {
    mask: any[] // Empty mask must be treated as no masking is required.
}

export interface ISecureInputProps extends IMaskedInputProps {
    secure: {
        getValue: (detail: IDetail, data: string) => string
    }
}

export interface ICheckboxProps {
    indeterminate?: boolean
}

export interface ICursor {
    cursorStart: number,
    cursorEnd: number,
    selectLength: number,
    newLengthIsPermitted: number
}
