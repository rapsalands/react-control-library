import React from 'react';
import { ICheckboxProps, ICustomInputProps } from '../../shared/interfacesDelegates/controlnterfaces';
import formUtility from '../formUtility';
import CustomInput from './customInput';
import { isDefined } from 'type-check-utility';

const Checkbox: React.FC<ICustomInputProps & ICheckboxProps> = ({ type, indeterminate, ...props }) => {

    const [indeter, setIndeter] = React.useState<boolean | undefined>(indeterminate);
    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    const [reference, setReference] = React.useState<any>();
    // React.useEffect(() => setData(props.checked || false), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'checkbox', props.id, indeter);

    React.useEffect(() => {
        // if (!reference || !reference.current) return;

        setIndeter(indeterminate);

        // if (isDefined(indeterminate)) {
        //     reference.current.indeterminate = indeter;
        // }
        // eslint-disable-next-line
    }, [indeterminate]);

    // React.useEffect(() => {
    //     if (reference && reference.current) reference.current.indeterminate = false;
    //     setData(props.checked || false);
    // }, [props.checked]);

    function onChange(e: any) {
        if (data !== e.target.checked) {
            setIndeter(false);
        }
        setData(e.target.checked);
        props.onChange && props.onChange(e);
    }

    function updateIndeterminate() {
        if (!isDefined(indeter)) return;

        if (reference && reference.current)
            reference.current.indeterminate = indeter;
    }

    updateIndeterminate();

    return (
        <CustomInput type='checkbox' setReference={setReference} checked={data} onChange={onChange} className={cn} {...props} />
    );
};

export default Checkbox;
