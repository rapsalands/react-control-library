import React from 'react';
import { IAllowSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import CustomInput from './customInput';

const AlphaNumeric: React.FC<IAllowSymbolsProps> = ({ allowSymbols = '', ...props }) => {

    const validation = new ValidationIns((data) => regexVali.alphaNumeric(data, allowSymbols));

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default AlphaNumeric;
