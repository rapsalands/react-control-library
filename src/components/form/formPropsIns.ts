import { IValidationProps } from './formProps';

export class ValidationIns implements IValidationProps {
    isValid: ((data: any) => boolean) | null | undefined;
    isValidChange: ((data: any) => boolean) | null | undefined;
    isValidBlur: ((data: any) => boolean) | null | undefined;
    isValidKeypress: ((data: any) => boolean) | null | undefined;

    constructor(isValid?: ((data: any) => boolean) | null, isValidBlur?: ((data: any) => boolean) | null, isValidChange?: ((data: any) => boolean) | null, isValidKeyPress?: ((data: any) => boolean) | null) {
        this.isValid = isValid;
        this.isValidBlur = isValidBlur;
        this.isValidChange = isValidChange;
        this.isValidKeypress = isValidKeyPress;
    }

}
