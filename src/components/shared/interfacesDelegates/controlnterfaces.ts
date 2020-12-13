import { DetailMode } from "../../form/detailMode";
import { ValidationType } from "../enumerations";
import { ICustomEventDelegate } from "./delegates";
import { IDetail } from "./eventInterfaces";

export interface ICustomInputProps extends React.HTMLProps<HTMLInputElement> {
    exactLength?: number;
    validation?: IValidationProps;
    inputTag?: any;
    detailModes?: DetailMode[],
    setReference?: (refSetter: ((ref: React.MutableRefObject<HTMLInputElement | undefined>) => void)) => void,
    extractValueToValidate?: (value) => any,
    extractValueToSet?: (value: string) => string,
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

export interface IMaskedInputProps {
    mask: any[]
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
