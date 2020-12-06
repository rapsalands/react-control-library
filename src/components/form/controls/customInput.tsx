import React, { } from 'react';
import { DetailMode } from '../detailMode';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { ValidationIns } from '../formPropsIns';
import { IChangeInputEvent, IFocusInputEvent, IKeyboardInputEvent } from '../../shared/interfacesDelegates/eventInterfaces';

const CustomInput: React.FC<ICustomInputProps> = ({ setReference, inputTag, validation, type, value, className, onKeyPress, onChange, onBlur, detailModes = [DetailMode.onBlur, DetailMode.onChange], exactLength, extractValueToValidate, extractValueToSet, ...props }) => {

    const inputRef = React.useRef();
    const [data, setData] = React.useState(value);
    const InputTag = inputTag;

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    React.useEffect(() => {
        setReference && setReference(getInputRef);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let newVal = extractValueToValidate ? extractValueToValidate(value) : value;

        if (extractValueToSet) {
            newVal = extractValueToSet(newVal);
            setData(newVal);
        }
    }, [value]);

    const changeEvent = (e: IChangeInputEvent) => onChange && onChange(e);

    const getInputRef = () => inputRef;

    const consolidatedProps = { type, exactLength, ...props };

    const validationParam = validation || new ValidationIns();
    const params = {
        type: type || 'text',
        className: className,
        onChange: (e: IChangeInputEvent) => {
            onChangeEvent(e, data, setData, changeEvent, validationParam, detailModes, consolidatedProps, extractValueToValidate, extractValueToSet)
        },
        onBlur: (e: IFocusInputEvent) => onBlurEvent(e, data, setData, onBlur, validationParam, detailModes, consolidatedProps, extractValueToValidate, extractValueToSet),
        onKeyPress: (e: IKeyboardInputEvent) => onKeyPressEvent(e, validationParam, onKeyPress, consolidatedProps, extractValueToValidate),
        value: data,
        checked: !!data,
        ...props
    };

    if (InputTag) {
        return <InputTag ref={inputRef} {...params} />;
    }
    // @ts-ignore
    return <input ref={inputRef} {...params} />;
};

export default CustomInput;
