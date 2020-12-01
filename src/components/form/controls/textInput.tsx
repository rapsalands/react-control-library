import React from 'react';
import { IRestrictSymbolsProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVal from '../validation/regexVal';
import CustomInput from './customInput';

const TextInput: React.FC<IRestrictSymbolsProps> = ({ restrictSymbols, validation, ...props }) => {

    function validationFunc(data) {
        const notPattern = regexVal.notPatternMatch(data, restrictSymbols || '');
        const pattern = regexVal.patternMatch(data, props.pattern || '');
        return !notPattern.isValid ? notPattern : pattern;
    }

    const valid = new ValidationIns((data) => validationFunc(data));

    return (
        <CustomInput validation={valid} {...props} />
    );
};

export default TextInput;
