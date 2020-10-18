import React from 'react';
import AppSettings from '../../../shared/appSettings';
import { DetailMode } from '../../detailMode';
import { ICustomInputProps, IPasswordProps } from '../formProps';
import { ValidationIns } from '../formPropsIns';
import { isPasswordValid } from '../formValidations';
import CustomInput from './customInput';

const Password: React.FC<ICustomInputProps & IPasswordProps> = ({ passwordCriteria = null, ...props }) => {

    const pc = passwordCriteria || AppSettings.defaultPasswordCriteria();

    const validation = new ValidationIns((data) => isPasswordValid(data, pc), [DetailMode.none], [DetailMode.onChange, DetailMode.onBlur]);

    return (
        <CustomInput type='password' validation={validation} />
    );
};

export default Password;
