import { DetailMode } from "../detailMode";
import { DetailIns } from "./formPropsIns";
import { validate } from "./formValidations";
import Constants from '../../shared/constants';

function populateDetail(e, detailModes, detailMode, isValidCB, data, props): boolean {
    const invalid = isValidCB && !isValidCB(data);

    if (detailModes.includes(detailMode)) {
        e.detail = invalid ? new DetailIns(e.detail, data, false, Constants.userInput) : validate(e, data, props);
    }
    return invalid;
}

function onChangeEvent(e, data, setData, onChangeCB, isValidCB, detailModes: DetailMode[], props) {

    const invalid = populateDetail(e, detailModes, DetailMode.onChange, isValidCB, e.target.value, props);

    if (invalid) {
        e.target.value = data || '';
        return;
    }

    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

function onBlurEvent(e, data, setData, onBlurCB, isValidCB, detailModes: DetailMode[], props) {

    populateDetail(e, detailModes, DetailMode.onBlur, isValidCB, data, props);

    onBlurCB && onBlurCB(e);
}

function onKeyPressEvent(e, isValidCB, onKeyPressCB, props) {
    if (isValidCB && !isValidCB(e.key)) {
        e.preventDefault();
        return;
    }
    onKeyPressCB && onKeyPressCB(e);
}

const FormEvents = { onChangeEvent, onBlurEvent, onKeyPressEvent };

export default FormEvents;
