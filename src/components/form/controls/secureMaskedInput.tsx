import React from 'react';
import maskUtility from '../../shared/maskUtility';
import { isDefined } from 'type-check-utility';
import { ICustomInputProps, ISecureInputProps } from '../formProps';
import MaskedInput from './maskedInput';

const SecureMaskedInput: React.FC<ICustomInputProps & ISecureInputProps> = ({ mask, secure, ...props }) => {

    function getReal(value) {
        if (isDefined(value)) {
            const toMaskResult = maskUtility.toMask(value, mask);
            return toMaskResult.value;
        }
        return '';
    }

    function getSecure(value) {
        if (!secure) return value;
        return secure.getValue(value);
    }

    const [real, setReal] = React.useState<any>(getReal(props.value));
    const [secureValue, setSecureValue] = React.useState<string>(getSecure(props.value));

    React.useEffect(() => {
        if (props.value === secureValue) return;

        // Convert to masked format
        const realValue = getReal(props.value);
        setReal(realValue);
        setSecureValue(getSecure(realValue));
        // eslint-disable-next-line
    }, [props.value]);

    function blurEvent(e) {
        setReal(secureValue);
        setSecureValue(getSecure(secureValue));
        props.onBlur && props.onBlur(e);
    }

    function focusEvent(e) {
        setSecureValue(real);
        props.onFocus && props.onFocus(e);
    }

    function changeEvent(e) {
        setSecureValue(e.target.value);
        props.onChange && props.onChange(e);
    }

    return (
        <MaskedInput mask={mask} {...props} onFocus={focusEvent} onBlur={blurEvent} onChange={changeEvent} value={secureValue} />
    );
};

export default SecureMaskedInput;
