import { isDefined, isNotDefinedOrEmptyObject, isRegex } from "type-check-utility";
import { IToValue, IToValueWithCursor } from "./interfacesDelegates/eventInterfaces";
import utility from "./utility";

function extractConstFromMask(mask: any[]): any[] {
    if (isNotDefinedOrEmptyObject(mask)) return [];
    return mask.filter(m => !isRegex(m));
}

function extractPureValue(data: any, mask: any[]): string {
    if (!isDefined(data) || mask.length === 0) return data;

    const regexps: any[] = mask.filter(n => isRegex(n));
    let result = '';

    let di = 0;
    for (let ri = 0; (ri < regexps.length && di < data.length); ri++) {
        const regex = regexps[ri] as RegExp;
        const val = data[di];

        if (regex.test(val)) {
            result += val;
        } else {
            ri--;
        }
        di++;
    }

    return result;
}

function toMaskWithCursor(e: any, mask: any[]): IToValueWithCursor {
    const { cursorStart, cursorEnd } = utility.cursor(e);

    const currentValue = e.target.value;
    const pureValue = extractPureValue(currentValue, mask) || '';
    let result = pureValue || '';

    if (mask.length === 0) {
        return { value: result, cursorStart, cursorEnd };
    }

    let cursorJump = 0; // Chars Added Before Cursor Position

    for (let i = 0; i < result.length; i++) {
        const m = mask[i];
        if (m === undefined) break;
        if (!isRegex(m) && m !== result[i]) {
            result = utility.insertAt(result, m, i);

            if (currentValue[i] !== m && i <= cursorStart)
                cursorJump = (cursorJump + 1);
        }
    }

    return { value: result, cursorStart: cursorStart + cursorJump, cursorEnd: cursorEnd + cursorJump };
}

function toMask(value: any, mask: any[]): IToValue {
    if (mask.length === 0) {
        return { value: value };
    }

    const currentValue = value;
    const pureValue = extractPureValue(currentValue, mask);
    let result = pureValue || '';

    for (let i = 0; i < result.length; i++) {
        const m = mask[i];
        if (m === undefined) break;
        if (!isRegex(m) && m !== result[i]) {
            result = utility.insertAt(result, m, i);
        }
    }

    return { value: result };
}

function updateEventArgs(e: any, toMaskResult: IToValueWithCursor) {
    e.target.value = toMaskResult.value;
    e.target.selectionStart = toMaskResult.cursorStart;
    e.target.selectionEnd = toMaskResult.cursorEnd;
}

function updateDetail(e: any, mask: any[]) {
    const value = e?.detail?.value;
    if (!value) return;

    const pureValue = extractPureValue(value, mask);
    e.detail.value = pureValue;
}

const maskUtility = { toMaskWithCursor, updateEventArgs, toMask, updateDetail, extractPureValue, extractConstFromMask };

export default maskUtility;
