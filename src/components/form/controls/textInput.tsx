import React from 'react';
import { IRestrictSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import CustomInput from './customInput';

const TextInput: React.FC<IRestrictSymbolsProps> = ({ restrictSymbols, validation, ...props }) => {

    function validationFunc(data) {
        const notPattern = regexVali.notPatternMatch(data, restrictSymbols || '');
        const pattern = regexVali.patternMatch(data, props.pattern || '');
        return !notPattern.isValid ? notPattern : pattern;
    }

    function extractToSet(data): string {
        return formUtility.getEachValidCharacter(data, (d) => regexVali.regexValidate(FormRegex.custom(restrictSymbols), d), false);
    }

    const valid = new ValidationIns((data) => validationFunc(data));

    return (
        <CustomInput validation={valid} {...props} extractValueToSet={extractToSet} />
    );
};

export default TextInput;
