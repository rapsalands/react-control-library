import Constants from "../shared/constants";
import Messages from "../shared/messages";
import { IDetail, IPasswordCriteria, IPasswordFailure } from "./formProps";
import { DetailIns, PasswordFailIns } from "./formPropsIns";
import FormRegex from "./formRegex";

function regexValidate(regex, data) {
    if (!data) return true;
    return new RegExp(regex).test(data);
}

export function alwaysValid(data: any): IDetail {
    return new DetailIns(null, data, true, null, null);
}

export function isNumber(data: any): IDetail {
    return new DetailIns(null, data, regexValidate(FormRegex.number(), data));
}

export function isDecimal(data: any, decimalLimit: number, maxLength: number): IDetail {
    const isValid = regexValidate(FormRegex.decimal(decimalLimit, maxLength), data);
    return new DetailIns(null, data, isValid);
}

export function isAlphaNumeric(data: any, allowSymbols: string): IDetail {
    const isValid = regexValidate(FormRegex.alphaNumeric(allowSymbols), data);
    return new DetailIns(null, data, isValid);
}

export function isEmail(data: any): IDetail {
    const isValid = regexValidate(FormRegex.email(), data);
    return new DetailIns(null, data, isValid);
}

export function isPatternMatch(data: any, pattern): IDetail {
    if (!pattern) return new DetailIns(null, data, true, null);
    const isValid = regexValidate(pattern, data);
    return new DetailIns(null, data, isValid);
}

export function isNotPatternMatch(data: any, restrictSymbols: string): IDetail {
    if (!data) return new DetailIns(null, data, true, null);
    const isValid = !regexValidate(FormRegex.custom(restrictSymbols), data);
    return new DetailIns(null, data, isValid);
}

export function validate(e: any, data: any, props: any): IDetail {
    props = props || {};
    data = data || '';

    if (!data) {
        if (props.required) {
            return new DetailIns(e.target.detail, data, false, 'required');
        }
        return new DetailIns(e.target.detail, data, true, null);
    }

    if (props.minLength && data && props.minLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'minLength');
    }

    if (props.exactLength && data && props.exactLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'exactLength');
    }

    if (props.min && +props.min > +data) {
        return new DetailIns(e.target.detail, data, false, 'min');
    }

    return new DetailIns(e.target.detail, data, true, null);
}

export function validateForRestriction(e: any, data: any, props: any): IDetail {
    props = props || {};
    data = data || '';

    if (!data) {
        return new DetailIns(e.target.detail, data, true, null);
    }

    if (props.maxLength && data && props.maxLength > data.length) {
        return new DetailIns(e.target.detail, data, false, 'maxLength');
    }

    if (props.max && +props.max < +data) {
        return new DetailIns(e.target.detail, data, false, 'max');
    }

    if (props.pattern && !(new RegExp(props.pattern).test(data))) {
        return new DetailIns(e.target.detail, data, false, 'pattern');
    }

    return new DetailIns(e.target.detail, data, true, null);
}

export function isPasswordValid(data: any, passwordCriteria: IPasswordCriteria): IDetail {

    data = data || '';

    const addPassFail = (key, message: any = null) => result.push(new PasswordFailIns(key, data, message));
    const validRange = (data, start, end) => data >= start && data <= end;
    const validSymbols = (data) => {
        const syms = Constants.ascii.symbols;
        return syms.includes(data);
    }

    function validate(toCompare, key, messageFunc, start, end, checkRange = true) {

        if (!toCompare) return;
        data = data || '';

        let count = 0;

        for (let i = 0; i < data.length; i++) {
            const el = checkRange ? data.charCodeAt(i) : data[i];
            const validFunc = checkRange ? validRange : validSymbols;
            const t = validFunc(el, start, end) ? 1 : 0;
            count += t;
        }

        if (count < toCompare) addPassFail(key, messageFunc(toCompare));
    }

    function checkSequence(key, start, end, toCompare, message) {
        let count = 0, nextEl = -1;
        for (let i = 0; i < data.length; i++) {
            const el = data.charCodeAt(i);

            if (count === 0) {
                if (validRange(el, start, end)) {
                    nextEl = el + 1;
                    count++;
                }
                else count = 0;
            }
            else {
                if (el === nextEl) {
                    nextEl++;
                    count++;
                }
            }

            if (count > toCompare) addPassFail(key, message);
        }
    }

    const result: IPasswordFailure[] = [];

    if (!data) {
        addPassFail('required', data);
        return new DetailIns(null, data, false, 'required', result);
    }
    const pc = passwordCriteria;
    const passMess = Messages.password;
    const ascii = Constants.ascii;

    if (pc.minLength && data.length < pc.minLength) addPassFail('minLength', passMess.minLength(pc.minLength));
    if (pc.maxLength && data.length > pc.maxLength) addPassFail('maxLength', passMess.maxLength(pc.maxLength));

    validate(pc.capital, 'capital', passMess.capital, ascii.A, ascii.Z);
    validate(pc.numberCount, 'numberCount', passMess.numberCount, ascii.zero, ascii.nine);
    validate(pc.symbols, 'symbols', passMess.symbols, 0, 0, false);

    checkSequence(Constants.attributes.numberSeq, ascii.zero, ascii.nine, pc.sequence?.number, passMess.numberSeq(pc.sequence?.number))
    checkSequence(Constants.attributes.characterSeq, ascii.a, ascii.z, pc.sequence?.characters, passMess.characterSeq(pc.sequence?.characters))

    return new DetailIns(null, data, !result.length, null, result);
}
