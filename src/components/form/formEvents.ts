import { DetailMode } from "./detailMode";
import { validate, validateForRestriction } from "./formValidations";
import { IDetail, IValidationProps } from "./formProps";

const detailHasError = (detail) => !!(detail && !detail.isValid);

function populateDetail(value, detailModes, detailMode, validation: IValidationProps, props, restrict: boolean = false): (IDetail | null) {
    const detail: IDetail | null | undefined = validation.isValid && validation.isValid(value);
    // If isValid not passed, below condition will be true.
    if (!detail) return null;

    if (detailModes.includes(detailMode)) {
        const validateFunc = restrict ? validateForRestriction : validate;
        return !detail.isValid ? detail : validateFunc(null, value, props);
    }
    return null;
}

function popDetail4Restrict(value, detailModes, detailMode, validation: IValidationProps, props): (IDetail | null) {
    return populateDetail(value, detailModes, DetailMode.onChange, validation, props, true);
}

function onChangeEvent(e, data, setData, onChangeCB, validation: IValidationProps, detailModes: DetailMode[], props, extractValueToValidate) {
    const value = extractValueToValidate ? extractValueToValidate(e.target.value) : e.target.value;
    e.detail = null;
    let detail = popDetail4Restrict(value, detailModes, DetailMode.onChange, validation, props);
    if (detailHasError(detail) && validation.preventInput.includes(DetailMode.onChange)) {
        e.target.value = data || '';
        e.detail = detail;
        return;
    }

    detail = populateDetail(value, detailModes, DetailMode.onChange, validation, props);
    e.detail = detail;
    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

function onBlurEvent(e, data, setData, onBlurCB, validation: IValidationProps, detailModes: DetailMode[], props, extractValueToValidate) {
    const value = extractValueToValidate && extractValueToValidate(e.target.value);
    e.detail = null;
    let detail = populateDetail(value, detailModes, DetailMode.onBlur, validation, data, props);
    if (!detailHasError(detail))
        popDetail4Restrict(value, detailModes, DetailMode.onBlur, validation, props);
    onBlurCB && onBlurCB(e);
}

function onKeyPressEvent(e, validation: IValidationProps, onKeyPressCB, props, extractValueToValidate) {
    e.detail = null;
    if (validation.preventInput.includes(DetailMode.onKeyPress)) {
        const detail = validation.isValid && validation.isValid(e.key);
        if (detail && !detail.isValid && validation.preventInput.includes(DetailMode.onKeyPress)) {
            e.preventDefault();
            return;
        }
    }
    onKeyPressCB && onKeyPressCB(e);
}

const FormEvents = { onChangeEvent, onBlurEvent, onKeyPressEvent };

export default FormEvents;
