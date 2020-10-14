import React from 'react';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../formTypes';

const CustomInput: React.FC<ICustomInputProps> = ({ isValid, type, value, className, onKeyPress, onChange, onBlur, ...props }) => {

    const [data, setData] = React.useState(value);

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    return (
        <input
            type={type || 'text'}
            className={className}
            onChange={(e) => onChangeEvent(e, data, setData, onChange, isValid, props)}
            onBlur={(e) => onBlurEvent(e, data, setData, onBlur, isValid, props)}
            onKeyPress={(e) => onKeyPressEvent(e, isValid, onKeyPress)}
            value={value}
            {...props}
        />
    );
};

export default CustomInput;
