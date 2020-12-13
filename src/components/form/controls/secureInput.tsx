import React from 'react';
import maskUtility from '../../shared/maskUtility';
import { isDefined } from 'type-check-utility';
import { ICustomInputProps, ISecureInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import MaskedInput from './maskedInput';
import { IDetail } from '../../shared/interfacesDelegates/eventInterfaces';

const SecureInput: React.FC<ICustomInputProps & ISecureInputProps> = ({ mask = [], secure, ...props }) => {

    const [real, setReal] = React.useState<any>(getReal(props.value));
    const [secureValue, setSecureValue] = React.useState<string>(getSecure({} as IDetail, props.value));
    const [extractToSet, setExtractToSet] = React.useState(() => (v) => extractValueToSetOnBlur(v));

    function getReal(value) {
        if (isDefined(value)) {
            const toMaskResult = maskUtility.toMask(value, mask);
            return toMaskResult.value;
        }
        return '';
    }

    function getSecure(detail: IDetail, value) {
        if (!secure) return value;
        return secure.getValue(detail, value);
    }

    React.useEffect(() => {
        if (props.value === secureValue) return;

        // Convert to masked format
        const realValue = getReal(props.value);
        setReal(realValue);
        setSecureValue(getSecure({} as IDetail, realValue));
        // eslint-disable-next-line
    }, [props.value]);

    function blurEvent(e) {
        setReal(secureValue);
        setSecureValue(getSecure(e.detail, secureValue));
        setExtractToSet(() => (v) => extractValueToSetOnBlur(v));
        props.onBlur && props.onBlur(e);
    }

    function focusEvent(e) {
        setSecureValue(real);
        setExtractToSet(() => (v) => extractValueToSetOnFocus(v));
        props.onFocus && props.onFocus(e);
    }

    function changeEvent(e) {
        setSecureValue(e.target.value);
        props.onChange && props.onChange(e);
    }

    function extractValueToSetOnBlur(value) {
        return getSecure({} as IDetail, value);
    }

    function extractValueToSetOnFocus(value) {
        return getReal(value);
    }

    return (
        <MaskedInput extractValueToSet={extractToSet} mask={mask} {...props} onFocus={focusEvent} onBlur={blurEvent} onChange={changeEvent} value={secureValue} />
    );
};

export default SecureInput;
