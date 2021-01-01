import { isDefined, isNotDefinedOrEmptyObject, isNotDefinedOrWhiteSpace } from "type-check-utility";
import FormRegex from "../form/formRegex";
import { INumberMask } from "./interfacesDelegates/controlInterfaces";
import { IToValue, IToValueWithCursor } from "./interfacesDelegates/eventInterfaces";
import utility from "./utility";

function extractPureValue(data: any, numberMask: INumberMask): string {
    if (!isDefined(data)) return data;

    let result = '';

    for (let i = 0; i < data.length; i++) {
        const d = data[i];
        if (numberMask.decimalLimit > 0 && d === numberMask.decimalSymbol) {
            result += d;
            continue;
        }

        if (!FormRegex.number().test(d)) continue;
        result += d;
    }

    return result;
}

function formatNumber(value: string, numberMask: INumberMask): string {
    // Format number 1000000 to 1,234,567
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, numberMask.thousandsSeparatorSymbol);
}

function replaceSymbols(value: string, numberMask: INumberMask): string {

    if (!value.includes(numberMask.decimalSymbol)) return value;

    const symbol = numberMask.decimalSymbol === '.' ? '\\.' : numberMask.decimalSymbol;
    const gr = new RegExp(symbol, 'g');

    // If decimal not allowed, then remove all symbols.
    if (numberMask.decimalLimit <= 0) {
        return value.replace(gr, '');
    }

    const firstSymbolIndex = value.indexOf(numberMask.decimalSymbol) + 1;
    const replace1 = value.substr(0, firstSymbolIndex);
    const part2 = value.slice(firstSymbolIndex);
    const replace2 = part2.replace(gr, '');

    // Splitting into two string and replacing all the dots (.'s) in the second string
    const resultStr = `${replace1}${replace2}`;

    return resultStr;
}

function formatCurrency(e, numberMask: INumberMask): IToValueWithCursor {

    let value = e.target.value;

    // Initial caret position 
    let cursorStart = e.target.selectionStart;
    let cursorEnd = e.target.selectionEnd;

    // Don't validate empty input
    if (isNotDefinedOrWhiteSpace(value)) { return { value, cursorStart, cursorEnd }; }

    value = replaceSymbols(value, numberMask);

    // Original length
    let original_len = value.length;

    // Check for decimal
    if (value.includes('.')) {

        // Get position of first decimal
        // This prevents multiple decimals from being entered
        let decimalPosition = value.indexOf(numberMask.decimalSymbol);

        // Split number by decimal point
        let lhsOfDecimal = value.substring(0, decimalPosition);
        let rhsOfDecimal = value.substring(decimalPosition + 1);

        // Add commas to left side of number
        lhsOfDecimal = formatNumber(lhsOfDecimal, numberMask);

        // Remove any invalid characters
        rhsOfDecimal = extractPureValue(rhsOfDecimal, numberMask);

        // Limit decimal to only {decimalLimit} digits
        rhsOfDecimal = rhsOfDecimal.substring(0, numberMask.decimalLimit);

        // Join number by decimalSymbol
        value = `${numberMask.prefix}${lhsOfDecimal}${numberMask.decimalSymbol}${rhsOfDecimal}`;

    } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        value = formatNumber(value, numberMask);
        value = `${numberMask.prefix}${value}${numberMask.suffix}`;

        // // final formatting
        // if (blur === "blur") {
        //     value += ".00";
        // }
    }

    // send updated string to input
    //input.value(value);

    // put caret back in the right position
    let updated_len = value.length;
    cursorStart = updated_len - original_len + cursorStart;

    return { value, cursorStart, cursorEnd: cursorStart };
}

function toNumberMaskWithCursor(e: any, numberMask: INumberMask): IToValueWithCursor {
    const { cursorStart, cursorEnd } = utility.cursor(e);

    const toValueWithCursor = formatCurrency(e, numberMask);

    // const currentValue = e.target.value;
    // const pureValue = extractPureValue(currentValue, numberMask) || '';
    // let result = pureValue || '';

    // // if (isNotDefinedOrEmptyObject(numberMask)) {
    // //     return { value: result, cursorStart, cursorEnd };
    // // }

    // let cursorJump = 0; // Chars Added Before Cursor Position

    // for (let i = 0; i < result.length; i++) {
    //     const m = numberMask[i];
    //     if (m === undefined) break;
    //     if (!isRegex(m) && m !== result[i]) {
    //         result = utility.insertAt(result, m, i);

    //         if (currentValue[i] !== m && i <= cursorStart)
    //             cursorJump = (cursorJump + 1);
    //     }
    // }

    // return { value: toValueWithCursor.value, cursorStart: cursorStart + cursorJump, cursorEnd: cursorEnd + cursorJump };
    return toValueWithCursor;
}

function toNumberMask(value: any, numberMask: INumberMask): IToValue {
    if (isNotDefinedOrEmptyObject(numberMask)) {
        return { value: value };
    }

    const pureValue = extractPureValue(value, numberMask);
    return { value: formatNumber(pureValue, numberMask) };
}

function updateEventArgs(e: any, toNumberMaskResult: IToValueWithCursor) {
    e.target.value = toNumberMaskResult.value;
    e.target.selectionStart = toNumberMaskResult.cursorStart;
    e.target.selectionEnd = toNumberMaskResult.cursorEnd;
}

function updateDetail(e: any, numberMask: INumberMask) {
    const value = e?.detail?.value;
    if (!value) return;

    const pureValue = extractPureValue(value, numberMask);
    e.detail.value = pureValue;
}

const numberMaskUtility = { toNumberMaskWithCursor, updateEventArgs, toNumberMask, updateDetail, extractPureValue };

export default numberMaskUtility;
