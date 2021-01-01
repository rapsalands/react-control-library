import React from 'react';
import maskUtility from '../../shared/maskUtility';
import { isRegex } from 'type-check-utility';
import utility from '../../shared/utility';
import { ICustomInputProps, IMaskedInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import CustomInput from './customInput';
import { ValidationIns } from '../formPropsIns';
import formVali from '../validation/formVali';
import { IToValueWithCursor } from '../../shared/interfacesDelegates/eventInterfaces';
import formUtility from '../formUtility';

const MaskedInput: React.FC<ICustomInputProps & IMaskedInputProps> = ({ mask = [], extractValueToSet, ...props }) => {

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

        if (mask.length === 0) {
            props.onKeyPress && props.onKeyPress(e);
            return;
        }

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

    function extractValueToSetLocal(e, value): IToValueWithCursor {
        const valueWithCursor = maskUtility.toMaskWithCursor(e || { target: { value } }, mask);
        return valueWithCursor;
    }

    function keyDownEvent(e) {
        function conditionToOnlyMoveBack(index) {
            return maskUtility.extractConstFromMask(mask).includes(e.target.value[index]);
        }
        formUtility.backspaceDoNotDelete(e, conditionToOnlyMoveBack);
    }

    const params = {
        validation: new ValidationIns(formVali.alwaysValid),
        onBlur,
        onChange: changeEvent,
        extractValueToValidate: (value) => maskUtility.extractPureValue(value, mask),
        onKeyPress: keyPressEvent,
        onKeyDown: keyDownEvent
    };

    return (
        <CustomInput extractValueToSet={extractValueToSet || extractValueToSetLocal} {...props} {...params} />
    );
};

export default MaskedInput;
