import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import regexVal from '../validation/regexVal';
import CustomInput from './customInput';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(regexVal.number);

    function extractToSet(data): string {
        return formUtility.getEachValidCharacter(data, (d) => regexVal.regexValidate(FormRegex.number(), d));
    }

    return (
        <CustomInput validation={validation} extractValueToSet={extractToSet} {...props} />
    );
};

export default NumberInput;
