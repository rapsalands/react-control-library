import React from 'react';
import { IAllowSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVal from '../validation/regexVal';
import CustomInput from './customInput';

const AlphaNumeric: React.FC<IAllowSymbolsProps> = ({ allowSymbols = '', ...props }) => {

    const validation = new ValidationIns((data) => regexVal.alphaNumeric(data, allowSymbols));

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default AlphaNumeric;
