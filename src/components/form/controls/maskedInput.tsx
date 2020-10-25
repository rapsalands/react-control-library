import React from 'react';
import typeUtility from '../../../shared/typeUtility';
import utility from '../../../shared/utility';
import { ICustomInputProps, IMaskedInputProps } from '../formProps';
import Regex from '../regex';

const MaskedInput: React.FC<ICustomInputProps & IMaskedInputProps> = ({ mask, ...props }) => {

    function changeEvent(e) {

        const { cursorStart, cursorEnd } = utility.cursor(e);
        let cursorJump = 0; // Chars Added Before Cursor Position

        const currentValue = e.target.value;
        const pureValue = Regex.pureValue(currentValue, mask);
        let result = pureValue;

        for (let i = 0; i < result.length; i++) {
            const m = mask[i];
            if (m === undefined) break;
            if (!typeUtility.isRegex(m) && m !== result[i]) {
                result = utility.insertAt(result, m, i);
                cursorJump = calculateCursorJump(i, m, cursorJump);
            }
        }

        e.target.value = result;

        updateCursorPosition();

        props.onChange && props.onChange(e);

        function updateCursorPosition() {
            e.target.selectionStart = cursorStart + cursorJump;
            e.target.selectionEnd = cursorEnd + cursorJump;
        }

        function calculateCursorJump(charIndex: number, currentmask: any, currentCursorJump: number): number {
            // Calculating the extra symbols that are added because of masking requirement.
            if (currentValue[charIndex] !== currentmask && charIndex <= cursorStart)
                return (currentCursorJump + 1);
            return currentCursorJump
        }

    }

    function keyPressEvent(e) {

        let { cursorStart: start, newLengthIsPermitted } = utility.cursor(e);
        if (newLengthIsPermitted >= mask.length) {
            e.preventDefault();
            props.onKeyPress && props.onKeyPress(e);
            return;
        }

        while (true) {
            if (start >= mask.length) {
                e.preventDefault();
                break;
            }
            const m = mask[start];
            if (typeUtility.isRegex(m)) {
                const reg = m as RegExp;
                if (!reg.test(e.key)) {
                    e.preventDefault();
                }
                break;
            } else {
                start++;
            }
        }

        props.onKeyPress && props.onKeyPress(e);
    }

    return (
        <input {...props} onChange={changeEvent} onKeyPress={keyPressEvent} />
    );
};

export default MaskedInput;
