import React from 'react';
import AppSettings from '../../shared/appSettings';
import { IDecimalInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import regexVali from '../validation/regexVali';
import CustomInput from './customInput';

const DecimalInput: React.FC<IDecimalInputProps> = ({ decimalLimit = 2, ...props }) => {

    const validation = new ValidationIns((data) => {
        return regexVali.decimal(data, decimalLimit, props.maxLength || AppSettings.decimal.maxLength)
    });

    function extractToSet(data): string {
        return formUtility.getEachValidCharacter(data, (d) => {
            return regexVali.regexValidate(FormRegex.decimal(), d);
        });
    }

    return (
        <CustomInput validation={validation} {...props} extractValueToSet={extractToSet} />
    );
};

export default DecimalInput;
