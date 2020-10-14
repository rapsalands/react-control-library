import React from 'react';
import { IRestrictSymbolsProps } from '../formProps';
import { ValidationIns } from '../formPropsIns';
import { isNotPatternMatch, isPatternMatch } from '../formValidations';
import CustomInput from './customInput';

const TextInput: React.FC<IRestrictSymbolsProps> = ({ restrictSymbols, validation, ...props }) => {

    function validationFunc(data) {
        return isNotPatternMatch(data, restrictSymbols || '') && isPatternMatch(data, props.pattern || '');
    }

    const valid = new ValidationIns((data) => validationFunc(data));

    return (
        <CustomInput validation={valid} {...props} />
    );
};

export default TextInput;
