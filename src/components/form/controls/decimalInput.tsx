import React from 'react';
import AppSettings from '../../shared/appSettings';
import { ValidationType } from '../../shared/enumerations';
import { IDecimalInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { IToValue } from '../../shared/interfacesDelegates/eventInterfaces';
import { DetailMode } from '../detailMode';
import { ValidationIns } from '../formPropsIns';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import regexVali from '../validation/regexVali';
import CustomInput from './customInput';

const DecimalInput: React.FC<IDecimalInputProps> = ({ decimalLimit = AppSettings.decimal.decimalLimit, maxLength = AppSettings.decimal.maxLength, ...props }) => {

    const validation = new ValidationIns((data) => {
        return regexVali.decimal(data, decimalLimit, maxLength)
    }, [DetailMode.onChange, DetailMode.onKeyPress], [ValidationType.maxLength]);

    function extractToSet(e, data): IToValue {
        const temp = formUtility.getEachValidCharacter(data, (d) => {
            return regexVali.regexValidate(FormRegex.decimal(decimalLimit, maxLength), d);
        });
        return { value: temp };
    }

    return (
        <CustomInput validation={validation} maxLength={maxLength} {...props} extractValueToSet={extractToSet} />
    );
};

export default DecimalInput;
