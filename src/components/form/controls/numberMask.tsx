import React from 'react';
import { isNotDefinedOrEmptyObject, isRegex } from 'type-check-utility';
import utility from '../../shared/utility';
import { ICustomInputProps, INumberMask, INumberMaskProps } from '../../shared/interfacesDelegates/controlInterfaces';
import CustomInput from './customInput';
import { ValidationIns } from '../formPropsIns';
import formVali from '../validation/formVali';
import { IToValueWithCursor } from '../../shared/interfacesDelegates/eventInterfaces';
import AppSettings from '../../shared/appSettings';
import numberMaskUtility from '../../shared/numberMaskUtility';

const NumberMask: React.FC<ICustomInputProps & INumberMaskProps> = ({ numberMask = {} as INumberMask, extractValueToSet, ...props }) => {

    numberMask = isNotDefinedOrEmptyObject(numberMask) ? AppSettings.defaultNumberMask() : numberMask;
    // numberMask.decimalLimit = 0;

    // prefix (string): what to display before the amount. Defaults to '$'.
    // suffix (string): what to display after the amount. Defaults to empty string.
    // thousandsSeparator (boolean): whether or not to separate thousands. Defaults to to true.
    // thousandsSeparatorSymbol (string): character with which to separate thousands. Default to ','.
    // decimalSymbol (string): character that will act as a decimal point. Defaults to '.'
    // decimalLimit (number): how many digits to allow after the decimal. Defaults to 2
    // maxLength (number): limit the length of the integer number. Defaults to null for unlimited
    // allowNegative (boolean): whether or not to allow negative numbers. Defaults to false

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

        let { cursorStart: start, newLengthIsPermitted } = utility.cursor(e);
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

    const params = {
        validation: new ValidationIns(formVali.alwaysValid),
        onBlur,
        onChange: changeEvent,
        extractValueToValidate: (value) => numberMaskUtility.extractPureValue(value, numberMask),
        onKeyPress: keyPressEvent
    };

    return (
        <CustomInput extractValueToSet={extractValueToSet || extractValueToSetLocal} {...props} {...params} />
    );
};

export default NumberMask;
