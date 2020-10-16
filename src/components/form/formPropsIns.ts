import { IDetail, IValidationProps } from './formProps';

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

export class DetailIns implements IDetail {
    constructor(detail: any, value: any, isValid: boolean, attribute: string | null) {
        this.detail = detail;
        this.value = value;
        this.isValid = isValid;
        this.attribute = attribute;
    }
    detail: any;
    value: any;
    isValid: boolean;
    attribute: string | null;
}
