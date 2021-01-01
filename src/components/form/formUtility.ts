import { ICustomInputProps } from "../shared/interfacesDelegates/controlInterfaces";
import { isDefined } from 'type-check-utility';
import utility from "../shared/utility";
import Constants from "../shared/constants";

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
 * Move cursor/caret back or forward based on key pressed. This happens if action is performed on any of the provided params.
 * e: Event Args for KeyDown (mostly).
 * predicate: function is returns true, move the cursor back and do not delete character.
 */
function backspaceDoNotDelete(e, conditionToOnlyMoveBack: (index: number) => boolean) {

    if (e.keyCode !== Constants.ascii.backspace) {
        return false;
    }

    let { cursorStart } = utility.cursor(e);

    const projectedStart = cursorStart - 1;

    if (projectedStart < 0) return;

    if (conditionToOnlyMoveBack(projectedStart)) {
        e.target.selectionStart = projectedStart;
        e.target.selectionEnd = projectedStart;
        e.preventDefault();
        return;
    }
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
    getBooleanControlClassName, getDefaultValue, getEachValidCharacter, backspaceDoNotDelete
};

export default formUtility;
