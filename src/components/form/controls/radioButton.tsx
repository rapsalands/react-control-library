import React from 'react';
import { ICustomInputProps } from '../formProps';
import CustomInput from './customInput';

const RadioButton: React.FC<ICustomInputProps> = ({ type, ...props }) => {

    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    React.useEffect(() => setData(props.checked), [props.checked]);

    const checkedCn = data ? `${props.name}_radio_checked` : '';
    const cn = `${checkedCn} ${props.className || ''}`.trim();

    return (
        <CustomInput type='radio' checked={data} className={cn} {...props} />
    );
};

export default RadioButton;
