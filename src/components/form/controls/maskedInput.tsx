import React from 'react';
import typeUtility from '../../../shared/typeUtility';
import utility from '../../../shared/utility';
import { ICustomInputProps, IMaskedInputProps } from '../formProps';
import Regex from '../regex';

const MaskedInput: React.FC<ICustomInputProps & IMaskedInputProps> = ({ mask, ...props }) => {

    function changeEvent(e) {

        const { cursorStart, cursorEnd, selectLength } = utility.cursor(e);
        let charAddedBeforeCursorPosition = 0;

        const currentValue = e.target.value;
        const pureValue = Regex.extractValue(currentValue, mask);
        let result = pureValue;

        for (let i = 0; i < result.length; i++) {
            const m = mask[i];
            if (!typeUtility.isRegex(m) && m !== result[i]) {
                result = utility.insertAt(result, m, i);
                if (i < cursorStart) charAddedBeforeCursorPosition++;
            }
        }

        e.target.value = result;

        e.target.selectionStart = cursorStart + charAddedBeforeCursorPosition - (selectLength > 0 ? 1 : 0);
        e.target.selectionEnd = cursorEnd + charAddedBeforeCursorPosition - (selectLength > 0 ? 1 : 0);
        props.onChange && props.onChange(e);
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
