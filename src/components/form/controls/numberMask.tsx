import React from 'react';
import { isDefined, isNotDefinedOrEmpty } from 'type-check-utility';
import utility from '../../shared/utility';
import { ICustomInputProps, INumberMask, INumberMaskProps } from '../../shared/interfacesDelegates/controlInterfaces';
import CustomInput from './customInput';
import { ValidationIns } from '../formPropsIns';
import formVali from '../validation/formVali';
import { IToValueWithCursor } from '../../shared/interfacesDelegates/eventInterfaces';
import AppSettings from '../../shared/appSettings';
import numberMaskUtility from '../../shared/numberMaskUtility';
import formUtility from '../formUtility';
import Constants from '../../shared/constants';

const NumberMask: React.FC<ICustomInputProps & INumberMaskProps> = ({ mask = {} as INumberMask, extractValueToSet, ...props }) => {

    mask = { ...AppSettings.defaultNumberMask(), ...mask };

    function changeEvent(e) {
        const toMaskResult = numberMaskUtility.toNumberMaskWithCursor(e, mask);
        numberMaskUtility.updateEventArgs(e, toMaskResult);
        numberMaskUtility.updateDetail(e, mask);

        props.onChange && props.onChange(e);
    }

    function onBlur(e) {

        let pureValue = numberMaskUtility.extractPureValue(e.target.value, mask);
        if (!isDefined(pureValue)) pureValue = '';

        // If control only has symbols like negative/decimal, then clear the control.
        if ([Constants.keyboard.hyphen, mask.decimalSymbol].includes(pureValue)) {
            numberMaskUtility.updateEventArgs(e, { value: '', cursorStart: 0, cursorEnd: 0 });
        }

        numberMaskUtility.updateDetail(e, mask);
        props.onBlur && props.onBlur(e);
    }

    function keyPressEvent(e) {

        if (!numberMaskUtility.isValidChar(e, mask)) {
            e.preventDefault();
        }

        props.onKeyPress && props.onKeyPress(e);
    }

    function extractValueToSetLocal(e, value): IToValueWithCursor {
        const valueWithCursor = numberMaskUtility.toNumberMaskWithCursor(e || { target: { value } }, mask);
        return valueWithCursor;
    }

    function keyDownEvent(e) {

        if (isNotDefinedOrEmpty(mask.thousandsSeparatorSymbol) || isNotDefinedOrEmpty(e.target.value)) {
            return;
        }

        const conditionToOnlyMoveBack = (index) => {
            // This is important as separator/suffix can be multi character long.
            const arr = utility.strings2FlatArray([mask.thousandsSeparatorSymbol, mask.suffix]);
            return arr.includes(e.target.value[index]);
        }

        // Handle backspace. Delete is handled automatically.
        formUtility.backspaceDoNotDelete(e, conditionToOnlyMoveBack);

        props.onKeyDown && props.onKeyDown(e);
    }

    const params = {
        validation: new ValidationIns(formVali.alwaysValid),
        onBlur,
        onChange: changeEvent,
        extractValueToValidate: (value) => numberMaskUtility.extractPureValue(value, mask),
        onKeyPress: keyPressEvent,
        onKeyDown: keyDownEvent
    };

    return (
        <CustomInput extractValueToSet={extractValueToSet || extractValueToSetLocal} {...props} {...params} />
    );
};

export default NumberMask;
