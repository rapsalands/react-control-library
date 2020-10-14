import Regex from "./regex";

function regexValidate(regex, data) {
    if (!data) return true;
    return new RegExp(regex).test(data);
}

export function isNumber(data: any) {
    return regexValidate(Regex.number(), data);
}

export function isDecimal(data: any) {
    return regexValidate(Regex.number(), data);
}
