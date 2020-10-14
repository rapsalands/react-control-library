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
