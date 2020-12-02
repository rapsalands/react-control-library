import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import CustomInput from './customInput';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(regexVali.number);

    function extractToSet(data): string {
        return formUtility.getEachValidCharacter(data, (d) => regexVali.regexValidate(FormRegex.number(), d));
    }

    return (
        <CustomInput validation={validation} extractValueToSet={extractToSet} {...props} />
    );
};

export default NumberInput;
