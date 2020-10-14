import React from 'react';
import { isNumber } from '../formValidations';
import CustomInput from './customInput';

const NumberInput = () => {
    return (
        <CustomInput isValid={isNumber} />
    );
};

export default NumberInput;
