import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import { isNumber } from '../formValidations';
import CustomInput from './customInput';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(isNumber);

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default NumberInput;
