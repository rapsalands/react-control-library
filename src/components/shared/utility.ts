import { ChangeEvent } from "react";
import { ICursor } from "./types";

const insertAt = (data, sub, pos): string => `${data.slice(0, pos)}${sub}${data.slice(pos)}`;

const cursor = (e: React.ChangeEvent<HTMLInputElement>): ICursor => {
    const start = e.target.selectionStart || 0;
    const end = e.target.selectionEnd || 0;
    const selectLength = end - start;
    const newLengthIsPermitted = (e.target.value || '').length - selectLength;
    return { cursorStart: start, cursorEnd: end, selectLength, newLengthIsPermitted };
}

const utility = { insertAt, cursor };

export default utility;
