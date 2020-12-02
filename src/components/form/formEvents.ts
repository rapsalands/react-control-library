import { DetailMode } from "./detailMode";
import { blurDelegate, changeDelegate, keyPressDelegate } from "../shared/interfacesDelegates/delegates";
import formVali from "./validation/formVali";

const detailHasError = (detail) => !!(detail && !detail.isValid);

/**
 * Common onChange event for all controls.
 * Control Specific & attribute based (basically all) validations are performed.
 * If validation fails, prevent the keystroke if needed.
 * @param e event args
 * @param data current data in control
 * @param setData state to set data
 * @param onChangeCB onChange callback
 * @param validation validation object with control specific validation method
 * @param detailModes modes in which detail object needs to be populated.
 * @param props all original props
 * @param extractValueToValidate few controls have decorated values like masked input. functin to extract those values for further processing
 */
const onChangeEvent: changeDelegate = (e, data, setData, onChangeCB, validation, detailModes, props, extractValueToValidate) => {

    const value = extractValueToValidate ? extractValueToValidate(e.target.value) : e.target.value;
    e.detail = null;

    let detail = validation.controlSpecific && validation.controlSpecific(value);
    if (detail && !detail.isValid && validation.preventInput.includes(DetailMode.onChange)) {
        e.target.value = data || '';
        e.detail = detail;
        return;
    }

    detail = formVali.forRestriction(detail, value, props);
    if (detailHasError(detail)) {
        e.target.value = data || '';
        e.detail = detail;
        return;
    }

    detail = formVali.general(detail, value, props);
    e.detail = detail;
    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

/**
 * Common onBlur event for all controls.
 * Control Specific validations are not performed as this is onBlur and value won't be changing.
 * Only attribute based validations are performed here. Mostly to populate detail object.
 * @param e event args
 * @param data current data in control
 * @param setData state to set data
 * @param onBlurCB onBlur callback
 * @param validation validation object with control specific validation method
 * @param detailModes modes in which detail object needs to be populated.
 * @param props all original props
 * @param extractValueToValidate few controls have decorated values like masked input. functin to extract those values for further processing
 */
const onBlurEvent: blurDelegate = (e, data, setData, onBlurCB, validation, detailModes, props, extractValueToValidate) => {
    const value = extractValueToValidate && extractValueToValidate(e.target.value);
    e.detail = null;

    let detail = formVali.general(null, value, props);

    if (!detailHasError(detail)) {
        detail = formVali.forRestriction(detail, value, props);
        e.detail = detail;
    }

    onBlurCB && onBlurCB(e);
}

/**
 * Common keyPress event for all controls. Takes a key (current keystroke) and validates.
 * Only control specific validation is performed here.
 * If validation fails, prevent the keystroke.
 * @param e event args
 * @param validation validation object with control specific validation method
 * @param onKeyPressCB keyPress callback
 * @param props all original props
 * @param extractValueToValidate few controls have decorated values like masked input. functin to extract those values for further processing
 */
const onKeyPressEvent: keyPressDelegate = (e, validation, onKeyPressCB, props, extractValueToValidate) => {
    e.detail = null;
    if (validation.preventInput.includes(DetailMode.onKeyPress)) {
        const detail = validation.controlSpecific && validation.controlSpecific(e.key);
        if (detail && !detail.isValid) {
            e.preventDefault();
            return;
        }
    }
    onKeyPressCB && onKeyPressCB(e);
}

const FormEvents = { onChangeEvent, onBlurEvent, onKeyPressEvent };

export default FormEvents;
