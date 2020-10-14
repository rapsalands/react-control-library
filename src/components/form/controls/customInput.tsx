import React from 'react';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../formProps';

const CustomInput: React.FC<ICustomInputProps> = ({ validation: vd, type, value, className, onKeyPress, onChange, onBlur, ...props }) => {

    const [data, setData] = React.useState(value);

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    return (
        <input
            type={type || 'text'}
            className={className}
            onChange={(e) => onChangeEvent(e, data, setData, onChange, vd?.isValid || vd?.isValidChange, props)}
            onBlur={(e) => onBlurEvent(e, data, setData, onBlur, vd?.isValid || vd?.isValidBlur, props)}
            onKeyPress={(e) => onKeyPressEvent(e, vd?.isValid || vd?.isValidKeypress, onKeyPress)}
            value={value}
            {...props}
        />
    );
};

export default CustomInput;
