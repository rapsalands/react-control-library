import React from 'react';
import maskUtility from '../../shared/maskUtility';
import { isRegex } from 'type-check-utility';
import utility from '../../shared/utility';
import { ICustomInputProps, IMaskedInputProps } from '../formProps';
import CustomInput from './customInput';
import { ValidationIns } from '../formPropsIns';
import { alwaysValid } from '../formValidations';

const MaskedInput: React.FC<ICustomInputProps & IMaskedInputProps> = ({ mask = [], ...props }) => {

    function changeEvent(e) {

        const toMaskResult = maskUtility.toMaskWithCursor(e, mask);
        maskUtility.updateEventArgs(e, toMaskResult);
        maskUtility.updateDetail(e, mask);

        props.onChange && props.onChange(e);
    }

    function onBlur(e) {
        maskUtility.updateDetail(e, mask);
        props.onBlur && props.onBlur(e);
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
            if (isRegex(m)) {
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
        <CustomInput {...props} validation={new ValidationIns(alwaysValid)} onBlur={onBlur} onChange={changeEvent} onKeyPress={keyPressEvent} />
    );
};

export default MaskedInput;
