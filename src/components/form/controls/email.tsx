import React from 'react';
import { DetailMode } from '../../detailMode';
import { ICustomInputProps } from '../formProps';
import { ValidationIns } from '../formPropsIns';
import { isEmail } from '../formValidations';
import CustomInput from './customInput';

const Email: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns(isEmail, [DetailMode.none]);

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default Email;
