import React from 'react';
import { IAllowSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import regexVali from '../validation/regexVali';
import CustomInput from './customInput';

const AlphaNumeric: React.FC<IAllowSymbolsProps> = ({ allowSymbols = '', ...props }) => {

    const validation = new ValidationIns((data) => regexVali.alphaNumeric(data, allowSymbols));

    function extractToSet(data): string {
        return formUtility.getEachValidCharacter(data, (d) => {
            const anValid = regexVali.regexValidate(FormRegex.alphaNumeric(), d);
            const asValid = regexVali.regexValidate(FormRegex.custom(allowSymbols), d);
            return anValid || asValid;
        });
    }

    return (
        <CustomInput validation={validation} {...props} extractValueToSet={extractToSet} />
    );
};

export default AlphaNumeric;
