import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import CustomInput from './customInput';
import { IToValue } from '../../shared/interfacesDelegates/eventInterfaces';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(regexVali.number);

    function extractToSet(e, data): IToValue {
        const temp = formUtility.getEachValidCharacter(data, (d) => regexVali.regexValidate(FormRegex.number(), d));
        return { value: temp };
    }

    return (
        <CustomInput validation={validation} extractValueToSet={extractToSet} {...props} />
    );
};

export default NumberInput;
