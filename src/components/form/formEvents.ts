import { DetailMode } from "./detailMode";
import fv from "./validation/formVal";
import { IDetail } from "../shared/interfacesDelegates/eventInterfaces";
import { blurDelegate, changeDelegate, keyPressDelegate, populateDetailDelegate } from "../shared/interfacesDelegates/delegates";

const detailHasError = (detail) => !!(detail && !detail.isValid);

const populateDetail: populateDetailDelegate = (e, value, detailModes, detailMode, validation, props, restrict: boolean = false) => {
    const detail: IDetail | null | undefined = validation.controlSpecific && validation.controlSpecific(e, value);
    // If isValid not passed, below condition will be true.
    if (!detail) return null;

    if (detailModes.includes(detailMode)) {
        const validateFunc = restrict ? fv.forRestriction : fv.general;
        return !detail.isValid ? detail : validateFunc(null, value, props);
    }
    return null;
}

const popDetail4Restrict: populateDetailDelegate = (e, value, detailModes, detailMode, validation, props) => {
    return populateDetail(e, value, detailModes, DetailMode.onChange, validation, props, true);
}

const onChangeEvent: changeDelegate = (e, data, setData, onChangeCB, validation, detailModes, props, extractValueToValidate) => {
    const value = extractValueToValidate ? extractValueToValidate(e.target.value) : e.target.value;
    e.detail = null;
    let detail = popDetail4Restrict(e, value, detailModes, DetailMode.onChange, validation, props);
    if (detailHasError(detail) && validation.preventInput.includes(DetailMode.onChange)) {
        e.target.value = data || '';
        e.detail = detail;
        return;
    }

    detail = populateDetail(e, value, detailModes, DetailMode.onChange, validation, props);
    e.detail = detail;
    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

const onBlurEvent: blurDelegate = (e, data, setData, onBlurCB, validation, detailModes, props, extractValueToValidate) => {
    const value = extractValueToValidate && extractValueToValidate(e.target.value);
    e.detail = null;
    let detail = populateDetail(e, value, detailModes, DetailMode.onBlur, validation, data, props);
    if (!detailHasError(detail))
        popDetail4Restrict(e, value, detailModes, DetailMode.onBlur, validation, props);
    onBlurCB && onBlurCB(e);
}

const onKeyPressEvent: keyPressDelegate = (e, validation, onKeyPressCB, props, extractValueToValidate) => {
    e.detail = null;
    if (validation.preventInput.includes(DetailMode.onKeyPress)) {
        const detail = validation.controlSpecific && validation.controlSpecific(e, e.key);
        if (detail && !detail.isValid) {
            e.preventDefault();
            return;
        }
    }
    onKeyPressCB && onKeyPressCB(e);
}

const FormEvents = { onChangeEvent, onBlurEvent, onKeyPressEvent };

export default FormEvents;
