import { ICustomInputProps } from "../shared/interfacesDelegates/controlnterfaces";
import { isDefined } from 'type-check-utility';

function getBooleanControlClassName(data: any, originalClassName: string | undefined, prefix: string, baseKey: string | undefined) {
    const id = baseKey ? `${baseKey}_` : '';
    const checkedCn = data ? `${id}${prefix}_checked` : '';
    const cn = `${checkedCn} ${originalClassName || ''}`.trim();
    return cn;
}

function getDefaultValue(props: ICustomInputProps) {
    if (isDefined(props.value)) return props.value;
    if (isDefined(props.checked)) return props.checked;
    return '';
}

const formUtility = {
    getBooleanControlClassName, getDefaultValue
};

export default formUtility;
