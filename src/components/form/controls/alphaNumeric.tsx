import React from 'react';
import { IAllowSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import { isAlphaNumeric } from '../formValidations';
import CustomInput from './customInput';

const AlphaNumeric: React.FC<IAllowSymbolsProps> = ({ allowSymbols = '', ...props }) => {

    const validation = new ValidationIns((data) => isAlphaNumeric(data, allowSymbols));

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default AlphaNumeric;
