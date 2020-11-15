import React from 'react';
import { DetailMode } from '../detailMode';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../formProps';
import { ValidationIns } from '../formPropsIns';

const CustomInput: React.FC<ICustomInputProps> = ({ setReference: refGetter, inputTag, validation, type, value, className, onKeyPress, onChange, onBlur, detailModes = [DetailMode.onBlur, DetailMode.onChange], ...props }) => {

    const inputRef = React.useRef();
    const [data, setData] = React.useState(value);
    const InputTag = inputTag;

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    React.useEffect(() => {
        refGetter && refGetter(getInputRef);
    }, []);

    const getInputRef = () => inputRef;

    const validationParam = validation || new ValidationIns();
    const params = {
        type: type || 'text',
        className: className,
        onChange: (e) => {
            onChangeEvent(e, data, setData, onChange, validationParam, detailModes, props)
        },
        onBlur: (e) => onBlurEvent(e, data, setData, onBlur, validationParam, detailModes, props),
        onKeyPress: (e) => onKeyPressEvent(e, validationParam, onKeyPress, props),
        value: value,
        checked: !!value,
        ...props
    };

    if (InputTag) {
        return <InputTag ref={inputRef} {...params} />;
    }
    // @ts-ignore
    return <input ref={inputRef} {...params} />;
};

export default CustomInput;
