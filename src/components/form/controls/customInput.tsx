import React, { } from 'react';
import { DetailMode } from '../detailMode';
import FormEvents from '../formEvents';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import { ValidationIns } from '../formPropsIns';
import { IChangeInputEvent, IFocusInputEvent, IKeyboardInputEvent } from '../../shared/interfacesDelegates/eventInterfaces';
import AppSettings from '../../shared/appSettings';

const CustomInput: React.FC<ICustomInputProps> = ({ setReference, inputTag, validation, type, value, className, onKeyPress, onChange, onBlur, detailModes = [DetailMode.onBlur, DetailMode.onChange], exactLength, extractValueToValidate, extractValueToSet, hasError, ...props }) => {

    const inputRef = React.useRef();
    const [data, setData] = React.useState(value);
    const [controlHasError, setControlHasError] = React.useState(hasError || false);
    const InputTag = inputTag;

    const { onBlurEvent, onChangeEvent, onKeyPressEvent } = FormEvents;

    React.useEffect(() => setControlHasError(hasError || false), [hasError]);

    React.useEffect(() => {
        setReference && setReference(getInputRef);
        // eslint-disable-next-line
    }, []);

    React.useEffect(() => {
        let newVal = extractValueToValidate ? extractValueToValidate(value) : value;

        if (extractValueToSet) {
            const valueToSet = extractValueToSet(null, newVal);
            newVal = valueToSet.value;

            if (validation && validation.controlSpecific) {
                const detail = validation.controlSpecific(newVal);
                if (!detail.isValid) {
                    newVal = '';
                }
            }
        }

        setData(newVal);
    }, [value]);

    const changeEvent = (e: IChangeInputEvent) => onChange && onChange(e);

    const getInputRef = () => inputRef;

    const consolidatedProps = { type, exactLength, ...props };

    const validationParam = validation || new ValidationIns();

    const cn = controlHasError ? AppSettings.error.defaultControlError : '';

    // For pure HTML controls, do not pass children object as that will throw HTML exception in React.
    const { children, ...params } = {
        type: type || 'text',
        className: `${cn} ${className || ''}`,
        onChange: (e: IChangeInputEvent) => {
            onChangeEvent(e, data, setData, changeEvent, validationParam, detailModes, consolidatedProps, extractValueToValidate, setControlHasError, extractValueToSet)
        },
        onBlur: (e: IFocusInputEvent) => onBlurEvent(e, data, setData, onBlur, validationParam, detailModes, consolidatedProps, extractValueToValidate, setControlHasError, extractValueToSet),
        onKeyPress: (e: IKeyboardInputEvent) => onKeyPressEvent(e, validationParam, onKeyPress, consolidatedProps, extractValueToValidate),
        value: data,
        checked: !!data,
        ...props
    };

    if (InputTag) {
        return <InputTag ref={inputRef} children={children} {...params} />;
    }

    // @ts-ignore
    return <input ref={inputRef} {...params} />;
};

export default CustomInput;
