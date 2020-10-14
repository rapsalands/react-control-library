import React from 'react';
import { IDecimalInputProps } from '../formProps';
import { ValidationIns } from '../formPropsIns';
import { isDecimal } from '../formValidations';
import CustomInput from './customInput';

const DecimalInput: React.FC<IDecimalInputProps> = ({ decimalLimit = 2, ...props }) => {

    const validation = new ValidationIns((data) => isDecimal(data, decimalLimit, props.maxLength || 20));

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default DecimalInput;
