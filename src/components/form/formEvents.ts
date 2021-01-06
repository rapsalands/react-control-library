import { DetailMode } from "./detailMode";
import { blurDelegate, changeDelegate, keyPressDelegate } from "../shared/interfacesDelegates/delegates";
import formVali from "./validation/formVali";
import utility from "../shared/utility";

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
const onChangeEvent: changeDelegate = (e, data, setData, onChangeCB, validation, detailModes, props, extractValueToValidate, setControlHasError, extractValueToSet) => {

    let value = e.target.value;
    e.detail = null;
    const tempData = data || '';

    if (extractValueToSet) {
        const valueToSet = extractValueToSet(e, value);
        utility.setEventArgsValue(e, valueToSet);

        value = valueToSet.value;
        setData && setData(value);
    }

    let value4Validation = extractValueToValidate ? extractValueToValidate(e.target.value) : e.target.value;
    let detail = validation.controlSpecific && validation.controlSpecific(value4Validation);

    // If we need not restrict keys in onChange, then move to next step.
    if (detail && !detail.isValid && validation.preventInput.includes(DetailMode.onChange)) {
        utility.setEventArgsValue(e, tempData);
        setData(tempData);
        e.detail = detail;
        return;
    }

    // We are here means we don't to restrict on onChange.
    // So check if we need to restrict because of restriction validation, if yes then function ends here.
    const detailRestriction = formVali.forRestriction(validation, null, value4Validation, props);
    if (detailHasError(detailRestriction)) {
        utility.setEventArgsValue(e, tempData);
        setData(tempData);
        e.detail = detailRestriction;
        return;
    }

    // We are here means restrictionValidation passed.
    // So check if we had controlSpecific validation error, if yes then pass that else check for general.
    if (!detailHasError(detail)) {
        const generalDetail = formVali.general(validation, null, value4Validation, props);
        if (generalDetail) {
            generalDetail.metadata = generalDetail.metadata || [];
            generalDetail.metadata = generalDetail.metadata.concat(detail?.metadata || []);
            detail = generalDetail;
        }
    }

    e.detail = detail;
    setControlHasError(e.detail && !e.detail.isValid);
    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

/**
 * Common onBlur event for all controls.
 * Control Specific validations are performed to fill the detail object as needed.
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
const onBlurEvent: blurDelegate = (e, data, setData, onBlurCB, validation, detailModes, props, extractValueToValidate, setControlHasError, extractValueToSet) => {
    let value = e.target.value;
    e.detail = null;
    const tempData = data || '';

    if (extractValueToSet) {
        const valueToSet = extractValueToSet(e, value);
        utility.setEventArgsValue(e, valueToSet);

        value = valueToSet.value;
        setData && setData(value);
    }

    let value4Validation = extractValueToValidate ? extractValueToValidate(e.target.value) : e.target.value;
    let detail = validation.controlSpecific && validation.controlSpecific(value4Validation);

    // If we need not restrict keys in onChange, then move to next step.
    if (detail && !detail.isValid && validation.preventInput.includes(DetailMode.onChange)) {
        utility.setEventArgsValue(e, tempData);
        setData(tempData);
        e.detail = detail;
        return;
    }

    // We are here means we don't to restrict on onChange.
    // So check if we need to restrict because of restriction validation, if yes then function ends here.
    const detailRestriction = formVali.forRestriction(validation, null, value4Validation, props);
    if (detailHasError(detailRestriction)) {
        utility.setEventArgsValue(e, tempData);
        setData(tempData);
        e.detail = detailRestriction;
        return;
    }

    // We are here means restrictionValidation passed.
    // So check if we had controlSpecific validation error, if yes then pass that else check for general.
    if (!detailHasError(detail)) {
        const generalDetail = formVali.general(validation, null, value4Validation, props);
        if (generalDetail) {
            generalDetail.metadata = generalDetail.metadata || [];
            generalDetail.metadata = generalDetail.metadata.concat(detail?.metadata || []);
            detail = generalDetail;
        }
    }

    e.detail = detail;
    setControlHasError(e.detail && !e.detail.isValid);
    setData && setData(e.target.value);
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
