import React from 'react';
import { ICustomInputProps, ISecureInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import { IDetail } from '../../shared/interfacesDelegates/eventInterfaces';
import maskUtility from '../../shared/maskUtility';
import utility from '../../shared/utility';
import formUtility from '../formUtility';
import MaskedInput from './maskedInput';

const SecureMaskedInput: React.FC<ICustomInputProps & ISecureInputProps> = ({ secure, onChange, mask, value, onFocus, onBlur, ...props }) => {

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

    function keyDownEvent(e) {
        function conditionToOnlyMoveBack(index) {
            const arr = utility.strings2FlatArray(maskUtility.extractConstFromMask(mask));
            return arr.includes(e.target.value[index]);
        }
        formUtility.backspaceDoNotDelete(e, conditionToOnlyMoveBack);
    }

    return (
        <MaskedInput
            mask={secureMask}
            onChange={changeEvent}
            onBlur={blurEvent}
            onFocus={focusEvent}
            value={secureValue}
            onKeyDown={keyDownEvent}
            {...props}
        />
    );
};

export default SecureMaskedInput;
