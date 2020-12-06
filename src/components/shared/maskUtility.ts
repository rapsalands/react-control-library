import { isDefined, isRegex } from "type-check-utility";
import utility from "./utility";

function extractPureValue(data: string, mask: any[] = []): string {
    if (!isDefined(data)) return data;
    
    const regexes: any[] = mask.filter(n => isRegex(n));
    let result = '';

    let di = 0;
    for (let ri = 0; (ri < regexes.length && di < data.length); ri++) {
        const regex = regexes[ri] as RegExp;
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

function toMaskWithCursor(e: any, mask: any[] = []): IToMaskWithCursor {
    const { cursorStart, cursorEnd } = utility.cursor(e);
    let cursorJump = 0; // Chars Added Before Cursor Position

    const currentValue = e.target.value;
    const pureValue = extractPureValue(currentValue, mask);
    let result = pureValue;

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

function toMask(value: any, mask: any[] = []): IToMask {
    const currentValue = value;
    const pureValue = extractPureValue(currentValue, mask);
    let result = pureValue;

    for (let i = 0; i < result.length; i++) {
        const m = mask[i];
        if (m === undefined) break;
        if (!isRegex(m) && m !== result[i]) {
            result = utility.insertAt(result, m, i);
        }
    }

    return { value: result };
}

function updateEventArgs(e: any, toMaskResult: IToMaskWithCursor) {
    e.target.value = toMaskResult.value;
    e.target.selectionStart = toMaskResult.cursorStart;
    e.target.selectionEnd = toMaskResult.cursorEnd;
}

function updateDetail(e: any, mask: any[] = []) {
    const value = e?.detail?.value;
    if (!value) return;

    const pureValue = extractPureValue(value, mask);
    e.detail.value = pureValue;
}

const maskUtility = { toMaskWithCursor, updateEventArgs, toMask, updateDetail, extractPureValue };

export default maskUtility;

export interface IToMask {
    value: any,
}

export interface IToMaskWithCursor extends IToMask {
    cursorStart: number,
    cursorEnd: number,
}
