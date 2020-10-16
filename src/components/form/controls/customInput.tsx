import React from 'react';
import { DetailMode } from '../../detailMode';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../formProps';

const CustomInput: React.FC<ICustomInputProps> = ({ inputTag, validation: vd, type, value, className, onKeyPress, onChange, onBlur, detailModes = [DetailMode.onBlur, DetailMode.onChange], ...props }) => {

    const [data, setData] = React.useState(value);
    const InputTag = inputTag;

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    const params = {
        type: type || 'text',
        className: className,
        onChange: (e) => {
            onChangeEvent(e, data, setData, onChange, vd?.isValid || vd?.isValidChange, detailModes, props)
        },
        onBlur: (e) => onBlurEvent(e, data, setData, onBlur, vd?.isValid || vd?.isValidBlur, detailModes, props),
        onKeyPress: (e) => onKeyPressEvent(e, vd?.isValid || vd?.isValidKeypress, onKeyPress, props),
        value: value,
        ...props
    };

    if (InputTag) {
        return <InputTag {...params} />;
    }
    return <input {...params} />;
};

export default CustomInput;
