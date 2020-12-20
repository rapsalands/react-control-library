import { ChangeEvent } from "react";
import { isDefined } from "type-check-utility";
import { ICursor } from "./interfacesDelegates/controlnterfaces";
import { IChangeInputEvent, IToValue, IToValueWithCursor } from "./interfacesDelegates/eventInterfaces";

const insertAt = (data, sub, pos): string => `${data.slice(0, pos)}${sub}${data.slice(pos)}`;

const cursor = (e: React.ChangeEvent<HTMLInputElement>): ICursor => {
    const start = e.target.selectionStart || 0;
    const end = e.target.selectionEnd || 0;
    const selectLength = end - start;
    const newLengthIsPermitted = (e.target.value || '').length - selectLength;
    return { cursorStart: start, cursorEnd: end, selectLength, newLengthIsPermitted };
}

function setEventArgsValue(e: IChangeInputEvent, valueToSet: IToValue | IToValueWithCursor) {
    e = e || {};
    let { selectionStart: oldStart, selectionEnd: oldEnd } = e.target || {};
    e.target.value = valueToSet.value;

    const valueWithCursor = (valueToSet as IToValueWithCursor);
    if (isDefined(valueWithCursor.cursorStart)) {
        oldStart = valueWithCursor.cursorStart;
        oldEnd = valueWithCursor.cursorEnd;
    }

    e.target.selectionStart = oldStart;
    e.target.selectionEnd = oldEnd;
}

const utility = { insertAt, cursor, setEventArgsValue };

export default utility;
