import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVal from '../validation/regexVal';
import CustomInput from './customInput';

const NumberInput: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(regexVal.number);

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default NumberInput;
