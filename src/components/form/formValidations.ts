import { IDetail } from "./formProps";
import { DetailIns } from "./formPropsIns";
import Regex from "./regex";

function regexValidate(regex, data) {
    if (!data) return true;
    return new RegExp(regex).test(data);
}

export function isNumber(data: any): boolean {
    return regexValidate(Regex.number(), data);
}

export function isDecimal(data: any, decimalLimit: number, maxLength: number): boolean {
    return regexValidate(Regex.decimal(decimalLimit, maxLength), data);
}

export function isAlphaNumeric(data: any, allowSymbols: string): boolean {
    return regexValidate(Regex.alphaNumeric(allowSymbols), data);
}

export function isEmail(data: any): boolean {
    return regexValidate(Regex.email(), data);
}

export function isPatternMatch(data: any, pattern): boolean {
    if (!pattern) return true;
    return regexValidate(pattern, data);
}

export function isNotPatternMatch(data: any, restrictSymbols: string): boolean {
    if (!data) return true;
    return !regexValidate(Regex.custom(restrictSymbols), data);
}

export function validate(e: any, data: any, props: any): IDetail {
    props = props || {};
    data = data || '';

    if (props.required && !data) {
        return new DetailIns(e.target.detail, data, false, 'required');
    }

    if (props.minLength && data && props.minLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'minLength');
    }

    if (props.maxLength && data && props.maxLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'maxLength');
    }

    if (props.exactLength && data && props.exactLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'exactLength');
    }

    if (props.max && +props.max < +data) {
        return new DetailIns(e.target.detail, data, false, 'max');
    }

    if (props.min && +props.min > +data) {
        return new DetailIns(e.target.detail, data, false, 'min');
    }

    if (props.pattern && !(new RegExp(props.pattern).test(data))) {
        return new DetailIns(e.target.detail, data, false, 'pattern');
    }

    return new DetailIns(e.target.detail, data, true, null);
}
