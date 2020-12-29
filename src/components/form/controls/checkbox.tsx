import React from 'react';
import { ICheckboxProps, ICustomInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import formUtility from '../formUtility';
import CustomInput from './customInput';
import { isDefined } from 'type-check-utility';

const Checkbox: React.FC<ICustomInputProps & ICheckboxProps> = ({ type, indeterminate, id, ...props }) => {

    const [indeter, setIndeter] = React.useState<boolean | undefined>(indeterminate);
    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    const [reference, setReference] = React.useState<any>();
    // React.useEffect(() => setData(props.checked || false), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'checkbox', id, indeter);

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

    if (props.inputTag) {
        return (
            <CustomInput type='checkbox'
                setReference={setReference}
                checked={data}
                id={id}
                onChange={onChange}
                className={cn} {...props}
            />
        );
    }

    let checkId: string | undefined = id;
    if (!isDefined(id)) {
        checkId = (Math.random() * Date.now()).toString();
    }

    return (
        <React.Fragment>
            <CustomInput type='checkbox' id={checkId} setReference={setReference} checked={data} onChange={onChange} className={cn} {...props} />
            <label htmlFor={checkId}>{props.label || props.children}</label>
        </React.Fragment>
    );
};

export default Checkbox;
