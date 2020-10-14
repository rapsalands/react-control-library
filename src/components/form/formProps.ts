interface IBaseInput extends React.HTMLProps<HTMLInputElement> {

}

export interface ICustomInputProps extends IBaseInput {
    validation?: IValidationProps
}

export interface IValidationProps {
    /** Overrides isValidChange/isValidBlur/isValidKeypress validation functions */
    isValid: ((data: any) => boolean) | undefined | null;
    /** Validates on onChange event of control */
    isValidChange: ((data: any) => boolean) | undefined | null;
    /** Validates on onBlur event of control */
    isValidBlur: ((data: any) => boolean) | undefined | null;
    /** Validates on onKeyPress event of control */
    isValidKeypress: ((data: any) => boolean) | undefined | null;
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
