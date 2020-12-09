import { IDetail } from "../../shared/interfacesDelegates/eventInterfaces";
import { DetailIns } from "../formPropsIns";
import FormRegex from "../formRegex";

function regexValidate(regex, data) {
    if (!data) return true;
    return new RegExp(regex).test(data);
}

function number(data: any): IDetail {
    return new DetailIns(null, data, regexValidate(FormRegex.number(), data));
}

function decimal(data: any, decimalLimit: number | undefined, maxLength: number): IDetail {
    const isValid = regexValidate(FormRegex.decimal(decimalLimit, maxLength), data);
    return new DetailIns(null, data, isValid);
}

function alphaNumeric(data: any, allowSymbols: string): IDetail {
    const isValid = regexValidate(FormRegex.alphaNumeric(allowSymbols), data);
    return new DetailIns(null, data, isValid);
}

function email(data: any, pattern: any = null): IDetail {
    const regex = pattern ? new RegExp(pattern) : FormRegex.email();
    const isValid = regexValidate(regex, data);
    return new DetailIns(null, data, isValid);
}

function patternMatch(data: any, pattern): IDetail {
    if (!pattern) return new DetailIns(null, data, true, null);
    const isValid = regexValidate(pattern, data);
    return new DetailIns(null, data, isValid);
}

function notPatternMatch(data: any, restrictSymbols: string): IDetail {
    if (!data) return new DetailIns(null, data, true, null);
    const isValid = !regexValidate(FormRegex.custom(restrictSymbols), data);
    return new DetailIns(null, data, isValid);
}

const regexVali = { regexValidate, number, decimal, notPatternMatch, patternMatch, email, alphaNumeric };

export default regexVali;
