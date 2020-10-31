import Regex from "../form/regex";
import { isRegex } from "type-check-utility";
import utility from "./utility";

function toMaskWithCursor(e: any, mask: any[]): IToMaskWithCursor {
    const { cursorStart, cursorEnd } = utility.cursor(e);
    let cursorJump = 0; // Chars Added Before Cursor Position

    const currentValue = e.target.value;
    const pureValue = Regex.pureValue(currentValue, mask);
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

function toMask(value: any, mask: any[]): IToMask {
    const currentValue = value;
    const pureValue = Regex.pureValue(currentValue, mask);
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

const maskUtility = { toMaskWithCursor, updateEventArgs, toMask };

export default maskUtility;

export interface IToMask {
    value: any,
}

export interface IToMaskWithCursor extends IToMask {
    cursorStart: number,
    cursorEnd: number,
}
