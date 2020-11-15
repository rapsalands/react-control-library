import React from 'react';
import { ICustomInputProps } from '../formProps';
import formUtility from '../formUtility';
import CustomInput from './customInput';

const Checkbox: React.FC<ICustomInputProps> = ({ type, ...props }) => {

    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    React.useEffect(() => setData(props.checked || false), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'checkbox', props.id);

    function onChange(e: any) {
        setData(e.target.checked);
        props.onChange && props.onChange(e);
    }

    return (
        <CustomInput type='checkbox' checked={data} onChange={onChange} className={cn} {...props} />
    );
};

export default Checkbox;
