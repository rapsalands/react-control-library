import { isDefined, isNotDefinedOrEmpty, isNotDefinedOrEmptyObject, isNotDefinedOrWhiteSpace } from "type-check-utility";
import FormRegex from "../form/formRegex";
import Constants from "./constants";
import { INumberMask } from "./interfacesDelegates/controlInterfaces";
import { IToValue, IToValueWithCursor } from "./interfacesDelegates/eventInterfaces";

/**
 * Calculates if key stroke entered is valid or not.
 * @param e event Args for KeyPress
 * @param numberMask Number Mask
 */
function isValidChar(e: any, numberMask: INumberMask) {

    const key = e?.key;
    if (isSpecialCase()) {
        switch (e.key) {

            case numberMask.decimalSymbol:
                if (numberMask.decimalLimit <= 0) return false;
                break;

            case Constants.keyboard.hyphen:
                if (e.target.selectionStart !== 0 || !numberMask.negativeAllowed) return false;
                break;

        }

        return true;
    }

    const validChar = FormRegex.number().test(key);
    if (!validChar) return false;

    return true;

    function isSpecialCase() {
        return key === numberMask.decimalSymbol || key === Constants.keyboard.hyphen;
    }
}

/**
 * Based on data and numberMask settings, returns negative symbol else empty string.
 */
function getNegativeSymbol(data, numberMask: INumberMask): string {
    if (isNotDefinedOrEmpty(data)) return '';

    if (numberMask.negativeAllowed) {
        if (data.startsWith(Constants.keyboard.hyphen))
            return Constants.keyboard.hyphen;
    }
    return '';
}

/**
 * Extract pure value from data passed. Also considers negative numbers based on numberMask settings.
 */
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

    const negSymbol = getNegativeSymbol(data, numberMask);
    result = `${negSymbol}${result}`;
    return result;
}

/**
 * Add Commas to the data passed. Excludes prefix, suffix is passed.
 */
function addCommas(value: string, numberMask: INumberMask): string {

    if (!isNotDefinedOrEmpty(numberMask.prefix)) {
        if (value.startsWith(numberMask.prefix)) {
            value = value.substring(numberMask.prefix.length);
        }
    }

    if (!isNotDefinedOrEmpty(numberMask.suffix)) {
        if (value.endsWith(numberMask.suffix)) {
            value = value.substring(0, value.length - numberMask.suffix.length);
        }
    }

    if (isNotDefinedOrEmpty(numberMask.thousandsSeparatorSymbol)) {
        return value;
    }

    const negSymbol = getNegativeSymbol(value, numberMask);
    value = negSymbol + value.replace(/\D/g, ""); // Removes all symbols (everything except digits). Leaves negative symbol if needed.
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, numberMask.thousandsSeparatorSymbol);
}

/**
 * Replaces numberMask.decimalSymbol with empty string except first one.
 * This is to avoid multiple decimal symbols in user input.
 */
function replaceDecimalSymbols(value: string, numberMask: INumberMask): string {

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

/**
 * Formats input as per the mask passed by user. Considers negative numbers, prefix and suffix.
 * Also returns the cursor position as per the updated masked text.
 */
function toNumberMaskWithCursor(e, numberMask: INumberMask): IToValueWithCursor {

    let value = e.target.value;
    let cursorStart = e.target.selectionStart;
    let cursorEnd = e.target.selectionEnd;

    // Don't validate empty input
    if (isNotDefinedOrWhiteSpace(value)) { return { value, cursorStart, cursorEnd }; }

    // Remove all decimal symbols except first one. This may occur if user copy paste text with multiple decimal symbols from outside.
    value = replaceDecimalSymbols(value, numberMask);

    // Original text length.
    let originalLength = value.length;

    // If float number
    if (value.includes('.')) {

        // Get position of first decimal
        // This prevents multiple decimals from being entered
        let decimalPosition = value.indexOf(numberMask.decimalSymbol);

        // Split number by decimal point
        let lhsOfDecimal = value.substring(0, decimalPosition);
        let rhsOfDecimal = value.substring(decimalPosition + 1);

        // Add commas to lhs of float number.
        lhsOfDecimal = addCommas(lhsOfDecimal, numberMask);

        // Remove any invalid characters
        rhsOfDecimal = extractPureValue(rhsOfDecimal, numberMask);

        // Limit decimal to only {decimalLimit} digits
        rhsOfDecimal = rhsOfDecimal.substring(0, numberMask.decimalLimit);

        // Concat number by decimalSymbol
        value = `${lhsOfDecimal}${numberMask.decimalSymbol}${rhsOfDecimal}`;

    } else {
        // Add commas to number and remove all non-digits when no decimal symbol found.
        value = addCommas(value, numberMask);
    }

    if (!isNotDefinedOrEmpty(value)) {
        const isNegative = value.startsWith(Constants.keyboard.hyphen);
        if (isNegative) {
            value = value.substring(1);
        }

        if (value === numberMask.decimalSymbol) {
            value = `0${value}`;
        }

        value = `${isNegative ? Constants.keyboard.hyphen : ''}${numberMask.prefix}${value}${numberMask.suffix}`;
    }

    // Update cursor position.
    let updatedLength = value.length;
    cursorStart = updatedLength - originalLength + cursorStart;

    // If user has typed the first character and we are also adding a suffix,
    // then make sure to pull the cursor back 1 level (if suffix length is 1, else back to suffix length)
    if (originalLength === 1 && !isNotDefinedOrEmpty(numberMask.suffix)) {
        cursorStart = cursorStart - numberMask.suffix.length;
    }

    return { value, cursorStart, cursorEnd: cursorStart };
}

/**
 * Formats input as per the mask passed by user. Considers negative numbers, prefix and suffix.
 */
function toNumberMask(value: any, numberMask: INumberMask): IToValue {
    if (isNotDefinedOrEmptyObject(numberMask)) {
        return { value: value };
    }

    const pureValue = extractPureValue(value, numberMask);
    return { value: addCommas(pureValue, numberMask) };
}

/**
 * Updates event Args with value and cursor position.
 */
function updateEventArgs(e: any, toNumberMaskResult: IToValueWithCursor) {
    e.target.value = toNumberMaskResult.value;
    e.target.selectionStart = toNumberMaskResult.cursorStart;
    e.target.selectionEnd = toNumberMaskResult.cursorEnd;
}

/**
 * Update e.detail property.
 */
function updateDetail(e: any, numberMask: INumberMask) {
    const value = e?.detail?.value;
    if (!value) return;

    const pureValue = extractPureValue(value, numberMask);
    e.detail.value = pureValue;
}

const numberMaskUtility = { toNumberMaskWithCursor, updateEventArgs, toNumberMask, updateDetail, extractPureValue, isValidChar };

export default numberMaskUtility;
