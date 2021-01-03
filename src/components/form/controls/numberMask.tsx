import React from 'react';
import { isNotDefinedOrEmpty } from 'type-check-utility';
import utility from '../../shared/utility';
import { ICustomInputProps, INumberMask, INumberMaskProps } from '../../shared/interfacesDelegates/controlInterfaces';
import CustomInput from './customInput';
import { ValidationIns } from '../formPropsIns';
import formVali from '../validation/formVali';
import { IToValueWithCursor } from '../../shared/interfacesDelegates/eventInterfaces';
import AppSettings from '../../shared/appSettings';
import numberMaskUtility from '../../shared/numberMaskUtility';
import formUtility from '../formUtility';

const NumberMask: React.FC<ICustomInputProps & INumberMaskProps> = ({ numberMask = {} as INumberMask, extractValueToSet, ...props }) => {

    numberMask = { ...AppSettings.defaultNumberMask(), ...numberMask };

    function changeEvent(e) {
        const toMaskResult = numberMaskUtility.toNumberMaskWithCursor(e, numberMask);
        numberMaskUtility.updateEventArgs(e, toMaskResult);
        numberMaskUtility.updateDetail(e, numberMask);

        props.onChange && props.onChange(e);
    }

    function onBlur(e) {
        numberMaskUtility.updateDetail(e, numberMask);
        props.onBlur && props.onBlur(e);
    }

    function keyPressEvent(e) {

        if (!numberMaskUtility.isValidChar(e.key, numberMask)) {
            e.preventDefault();
        }

        // let { cursorStart: start, newLengthIsPermitted } = utility.cursor(e);

        // if (e.keyCode === Constants.ascii.backspace) {
        //     if (e.target.value[--start] === numberMask.thousandsSeparatorSymbol) {
        //         e.target.selectionStart = start;
        //         e.target.selectionEnd = start;
        //         e.preventDefault();
        //     }
        // }

        // if (newLengthIsPermitted >= numberMask.length) {
        //     e.preventDefault();
        //     props.onKeyPress && props.onKeyPress(e);
        //     return;
        // }

        // while (true) {
        //     // if (start >= numberMask.length) {
        //     //     e.preventDefault();
        //     //     break;
        //     // }
        //     const m = numberMask[start];
        //     if (isRegex(m)) {
        //         const reg = m as RegExp;
        //         if (!reg.test(e.key)) {
        //             e.preventDefault();
        //         }
        //         break;
        //     } else {
        //         start++;
        //     }
        // }

        props.onKeyPress && props.onKeyPress(e);
    }

    function extractValueToSetLocal(e, value): IToValueWithCursor {
        const valueWithCursor = numberMaskUtility.toNumberMaskWithCursor(e || { target: { value } }, numberMask);
        return valueWithCursor;
    }

    function keyDownEvent(e) {

        if (isNotDefinedOrEmpty(numberMask.thousandsSeparatorSymbol) || isNotDefinedOrEmpty(e.target.value)) {
            return;
        }

        const conditionToOnlyMoveBack = (index) => {
            // This is important as separator/suffix can be multi character long.
            const arr = utility.strings2FlatArray(numberMask.thousandsSeparatorSymbol, numberMask.suffix);
            return arr.includes(e.target.value[index]);
        }

        // Handle backspace. Delete is handled automatically.
        formUtility.backspaceDoNotDelete(e, conditionToOnlyMoveBack);
    }

    const params = {
        validation: new ValidationIns(formVali.alwaysValid),
        onBlur,
        onChange: changeEvent,
        extractValueToValidate: (value) => numberMaskUtility.extractPureValue(value, numberMask),
        onKeyPress: keyPressEvent,
        onKeyDown: keyDownEvent
    };

    return (
        <CustomInput extractValueToSet={extractValueToSet || extractValueToSetLocal} {...props} {...params} />
    );
};

export default NumberMask;
