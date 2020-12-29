import React from 'react';
import { DetailMode } from '../detailMode';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import { ValidationIns } from '../formPropsIns';
import CustomInput from './customInput';
import regexVali from '../validation/regexVali';
import { ValidationType } from '../../shared/enumerations';

const Email: React.FC<ICustomInputProps> = ({ ...props }) => {

    const validation = new ValidationIns((data) => regexVali.email(data, props.pattern), [DetailMode.none], [ValidationType.pattern]);

    return (
        <CustomInput validation={validation} {...props} />
    );
};

export default Email;
