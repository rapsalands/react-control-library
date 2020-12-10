import { ICustomInputProps } from "../shared/interfacesDelegates/controlnterfaces";
import { isDefined } from 'type-check-utility';

function getBooleanControlClassName(data: boolean | undefined, originalClassName: string | undefined, prefix: string, baseKey: string | undefined, indeterminate: boolean = false) {

    const id = baseKey ? `${baseKey}_` : '';

    let checkedCn = '';
    if (indeterminate) {
        checkedCn = `${id}${prefix}_indeterminate`;
    } else if (data) {
        checkedCn = `${id}${prefix}_checked`;
    }

    const cn = `${checkedCn} ${originalClassName || ''}`.trim();
    return cn;
}

function getDefaultValue(props: ICustomInputProps) {
    if (isDefined(props.value)) return props.value;
    if (isDefined(props.checked)) return props.checked;
    return '';
}

/**
 * 
 * @param data 
 * @param validateFunc Validates each character. If true, character is included.
 * @param isInvalidFunction When true, we will take characters which fails (returns false) for validateFunc.
 */
function getEachValidCharacter(data: string, validateFunc: ((data: string) => boolean), isValidateFuncValid: boolean = true): string {

    if (!isDefined(data)) return data;

    let result: string = '';

    for (let i = 0; i < data.length; i++) {
        const el = data[i];
        const isCharValid = validateFunc(el);

        if (isValidateFuncValid) {
            if (isCharValid) {
                result += el;
            }
        } else {
            if (!isCharValid) {
                result += el;
            }
        }
    }

    return result;
}

const formUtility = {
    getBooleanControlClassName, getDefaultValue, getEachValidCharacter
};

export default formUtility;
