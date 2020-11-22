import React from 'react';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import formUtility from '../formUtility';
import CustomInput from './customInput';

const RadioButton: React.FC<ICustomInputProps> = ({ type, ...props }) => {

    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    React.useEffect(() => setData(props.checked), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'radio', props.name);

    return (
        <CustomInput type='radio' checked={data} className={cn} {...props} />
    );
};

export default RadioButton;
