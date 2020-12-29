import React from 'react';
import { isDefined } from 'type-check-utility';
import { ICustomInputProps } from '../../shared/interfacesDelegates/controlInterfaces';
import formUtility from '../formUtility';
import CustomInput from './customInput';

const RadioButton: React.FC<ICustomInputProps> = ({ type, id, ...props }) => {

    const [data, setData] = React.useState<boolean | undefined>(props.checked || false);
    React.useEffect(() => setData(props.checked), [props.checked]);

    const cn = formUtility.getBooleanControlClassName(data, props.className, 'radio', props.name);

    if (props.inputTag) {
        return (
            <CustomInput type='radio'
                checked={data}
                id={id}
                className={cn} {...props}
            />
        );
    }

    let radioId: string | undefined = id;
    if (!isDefined(id)) {
        radioId = (Math.random() * Date.now()).toString(); // random id
    }

    return (
        <React.Fragment>
            <CustomInput type='radio' id={radioId} checked={data} className={cn} {...props} />
            <label htmlFor={radioId}>{props.label || props.children}</label>
        </React.Fragment>
    );
};

export default RadioButton;
