import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import CustomInput from './customInput';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(regexVali.number);

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default NumberInput;
