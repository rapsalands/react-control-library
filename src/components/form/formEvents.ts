import { DetailMode } from "../detailMode";
import { validate } from "./formValidations";
import { IDetail, IValidationProps } from "./formProps";

function populateDetail(e, detailModes, detailMode, validation: IValidationProps, data, props): IDetail | undefined {
    const detail: IDetail | null | undefined = validation.isValid && validation.isValid(data);
    if (!detail) return undefined;

    if (detailModes.includes(detailMode)) {
        e.detail = !detail.isValid ? detail : validate(e, data, props);
    }
    return detail;
}

function onChangeEvent(e, data, setData, onChangeCB, validation: IValidationProps, detailModes: DetailMode[], props) {

    if (validation.runOn.includes(DetailMode.onChange)) {
        const detail = populateDetail(e, detailModes, DetailMode.onChange, validation, e.target.value, props);
        if (detail && !detail.isValid && validation.preventInput.includes(DetailMode.onChange)) {
            e.target.value = data || '';
            return;
        }
    }

    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

function onBlurEvent(e, data, setData, onBlurCB, validation: IValidationProps, detailModes: DetailMode[], props) {
    if (validation.runOn.includes(DetailMode.onBlur)) {
        populateDetail(e, detailModes, DetailMode.onBlur, validation, data, props);
    }
    onBlurCB && onBlurCB(e);
}

function onKeyPressEvent(e, validation: IValidationProps, onKeyPressCB, props) {
    if (validation.runOn.includes(DetailMode.onKeyPress)) {
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
