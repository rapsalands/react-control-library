import React from 'react';
import { ICheckboxProps, ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import formUtility from '../formUtility';
import CustomInput from './customInput';
import { isDefined } from 'type-check-utility';

const Checkbox: React.FC<ICustomInputProps & ICheckboxProps> = ({ type, indeterminate, ...props }) => {

    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    const [reference, setReference] = React.useState<any>();
    React.useEffect(() => setData(props.checked || false), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'checkbox', props.id);

    React.useEffect(() => {
        if (!reference || !reference.current) return;

        if (isDefined(indeterminate)) {
            reference.current.indeterminate = indeterminate;
        }
        // eslint-disable-next-line
    }, [indeterminate]);

    function onChange(e: any) {
        setData(e.target.checked);
        props.onChange && props.onChange(e);
    }

    return (
        <CustomInput type='checkbox' setReference={setReference} checked={data} onChange={onChange} className={cn} {...props} />
    );
};

export default Checkbox;
