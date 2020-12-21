import React from 'react';
import { ICustomInputProps, ISecureInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import { IDetail } from '../../shared/interfacesDelegates/eventInterfaces';
import maskUtility from '../../shared/maskUtility';
import MaskedInput from './maskedInput';

const SecureInput: React.FC<ICustomInputProps & ISecureInputProps> = ({ secure, onChange, mask, value, onFocus, onBlur, ...props }) => {

    function getSecureValue(value: any): string {
        if (!secure || !secure.getValue) return value;

        value = value || '';

        const pureValue = maskUtility.extractPureValue(value, mask);
        const maskedValue = maskUtility.toMask(pureValue, mask).value;

        const detail = {
            value: maskUtility.extractPureValue(value, mask),
            isValid: true,
            metadata: ['Unknown Validity']
        } as IDetail;
        return secure.getValue(detail, maskedValue);
    }

    const [realValue, setRealValue] = React.useState(value);
    const [secureValue, setSecureValue] = React.useState(getSecureValue(value));

    const [realMask, setRealMask] = React.useState<any[]>(mask);
    const [secureMask, setSecureMask] = React.useState<any[]>([]);

    React.useEffect(() => {

        if (secureValue === value) return;

        setSecureValue(getSecureValue(value));

        const pureValue = maskUtility.extractPureValue(value, mask);
        setRealValue(pureValue);
    }, [value]);

    function focusEvent(e) {

        setSecureValue(maskUtility.toMask(realValue, realMask).value);
        setSecureMask(realMask);

        onFocus && onFocus(e);
    }

    function blurEvent(e) {

        setRealValue(maskUtility.extractPureValue(secureValue, realMask));
        setSecureValue(getSecureValue(secureValue));

        setSecureMask([]);

        onBlur && onBlur(e);
    }

    function changeEvent(e) {
        const maskedValue = maskUtility.toMask(e.target.value, mask).value;
        setSecureValue(maskedValue);
        e.target.value = maskedValue;
        onChange && onChange(e);
    }

    return (
        <MaskedInput mask={secureMask} onChange={changeEvent} onBlur={blurEvent} onFocus={focusEvent} value={secureValue} {...props} />
    );
};

export default SecureInput;
