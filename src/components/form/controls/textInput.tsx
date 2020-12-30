import React from 'react';
import { IRestrictSymbolsProps } from '../../shared/interfacesDelegates/controlInterfaces';
import { ValidationIns } from '../formPropsIns';
import regexVali from '../validation/regexVali';
import FormRegex from '../formRegex';
import formUtility from '../formUtility';
import CustomInput from './customInput';
import { IToValue } from '../../shared/interfacesDelegates/eventInterfaces';

const TextInput: React.FC<IRestrictSymbolsProps> = ({ restrictSymbols, validation, ...props }) => {

    restrictSymbols = FormRegex.addEscapeToRegex(restrictSymbols);

    function validationFunc(data) {
        const notPattern = regexVali.notPatternMatch(data, restrictSymbols || '');
        const pattern = regexVali.patternMatch(data, props.pattern || '');
        return !notPattern.isValid ? notPattern : pattern;
    }

    function extractToSet(e, data): IToValue {
        const temp = formUtility.getEachValidCharacter(data, (d) => regexVali.regexValidate(FormRegex.custom(restrictSymbols), d), false);
        return { value: temp };
    }

    const valid = new ValidationIns((data) => validationFunc(data));

    return (
        <CustomInput validation={valid} {...props} extractValueToSet={extractToSet} />
    );
};

export default TextInput;
