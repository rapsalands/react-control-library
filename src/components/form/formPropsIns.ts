import Constants from '../shared/constants';
import { DetailMode } from './detailMode';
import { IPasswordCriteria, IPasswordFailure as IPasswordFail, IValidationProps } from '../shared/interfacesDelegates/controlnterfaces';
import { IDetail } from '../shared/interfacesDelegates/eventInterfaces';

export class ValidationIns implements IValidationProps {
    controlSpecific: ((data: any) => IDetail) | null | undefined;
    preventInput: DetailMode[];

    constructor(controlSpecific?: ((data: any) => IDetail) | null, preventInput = [DetailMode.onChange, DetailMode.onKeyPress]) {
        this.controlSpecific = controlSpecific;
        this.preventInput = preventInput;
    }
}

export class DetailIns implements IDetail {
    constructor(detail: any, value: any, isValid: boolean = true, attribute: string | null = Constants.userInput, metadata: any = null) {
        this.detail = detail;
        this.value = value;
        this.isValid = !!isValid;
        this.attribute = attribute;
        this.metadata = metadata;
    }
    detail: any;
    value: any;
    isValid: boolean;
    attribute: string | null;
    metadata: any;
}

export class PasswordCriteriaIns implements IPasswordCriteria {

    constructor(capital: number = 1, minLength: number = 8, maxLength: number = 0, numberCount: number = 1, symbols: number = 1, restrictSymbols: string = '', sequence: { number: number, characters: number } | null = null) {
        this.capital = capital;
        this.minLength = minLength;
        this.maxLength = maxLength;
        this.numberCount = numberCount;
        this.symbols = symbols;
        this.sequence = sequence || { number: 0, characters: 0 };
        this.restrictSymbols = restrictSymbols;
    }

    capital: number;
    minLength: number;
    maxLength: number;
    numberCount: number;
    symbols: number;
    sequence: { number: number; characters: number; };
    restrictSymbols: string;
}

export class PasswordFailIns implements IPasswordFail {

    constructor(attribute: string, value: any, message: string | null = null, metadata: any = null) {
        this.attribute = attribute;
        this.value = value;
        this.message = message;
        this.metadata = metadata;
    }

    attribute: string;
    value: any;
    message: string | null;
    metadata: any;
}
