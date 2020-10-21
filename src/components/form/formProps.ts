import { DetailMode } from "../detailMode";

export interface ICustomInputProps extends React.HTMLProps<HTMLInputElement> {
    exactLength?: number;
    validation?: IValidationProps;
    inputTag?: any;
    detailModes?: DetailMode[]
}

export interface IValidationProps {
    isValid: ((data: any) => IDetail) | undefined | null;
    /** Prevent user Inputs once following when vlidation fails. Defaults to onChange and onKeyPress */
    preventInput: DetailMode[];
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

export interface IDetail {
    detail: any,
    value: any,
    isValid: boolean,
    attribute: string | null,
    metadata?: any
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
