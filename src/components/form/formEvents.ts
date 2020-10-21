import { DetailMode } from "../detailMode";
import { validate, validateForRestriction } from "./formValidations";
import { IDetail, IValidationProps } from "./formProps";

const eHasError = (e) => !!(e.detail && !e.detail.isValid);

function popDetail(e, detailModes, detailMode, validation: IValidationProps, data, props, restrict: boolean = false): void {
    const detail: IDetail | null | undefined = validation.isValid && validation.isValid(data);
    // If isValid not passed, below condition will be true.
    if (!detail) return undefined;

    if (detailModes.includes(detailMode)) {
        const validateFunc = restrict ? validateForRestriction : validate;
        e.detail = !detail.isValid ? detail : validateFunc(e, data, props);
    }
}

function popDetail4Restrict(e, detailModes, detailMode, validation: IValidationProps, data, props): void {
    popDetail(e, detailModes, DetailMode.onChange, validation, e.target.value, props, true);
}

function onChangeEvent(e, data, setData, onChangeCB, validation: IValidationProps, detailModes: DetailMode[], props) {
    e.detail = null;
    popDetail4Restrict(e, detailModes, DetailMode.onChange, validation, e.target.value, props);
    if (eHasError(e) && validation.preventInput.includes(DetailMode.onChange)) {
        e.target.value = data || '';
        return;
    }

    popDetail(e, detailModes, DetailMode.onChange, validation, e.target.value, props);
    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

function onBlurEvent(e, data, setData, onBlurCB, validation: IValidationProps, detailModes: DetailMode[], props) {
    e.detail = null;
    popDetail(e, detailModes, DetailMode.onBlur, validation, data, props);
    if (!eHasError(e))
        popDetail4Restrict(e, detailModes, DetailMode.onBlur, validation, data, props);
    onBlurCB && onBlurCB(e);
}

function onKeyPressEvent(e, validation: IValidationProps, onKeyPressCB, props) {
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
