import React from 'react';
import AppSettings from '../../shared/appSettings';
import { DetailMode } from '../detailMode';
import { ICustomInputProps, IPasswordProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import CustomInput from './customInput';
import passwordVali from '../validation/passwordVali';

const Password: React.FC<ICustomInputProps & IPasswordProps> = ({ passwordCriteria = null, ...props }) => {

    const pc = passwordCriteria || AppSettings.defaultPasswordCriteria();

    const validation = new ValidationIns((data) => passwordVali.isPasswordValid(data, pc), [DetailMode.none]);

    return (
        <CustomInput type='password' validation={validation} {...props} />
    );
};

export default Password;
