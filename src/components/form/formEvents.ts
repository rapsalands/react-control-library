function onChangeEvent(e, data, setData, onChangeCB, isValidCB: ((data: any) => boolean) | undefined, props) {
    if (isValidCB && !isValidCB(e.target.value)) {
        e.target.value = data || '';
        return;
    }

    setData && setData(e.target.value);
    onChangeCB && onChangeCB(e);
}

function onBlurEvent(e, data, setData, onBlurCB, isValidCB: ((data: any) => boolean) | undefined, props) {

}

function onKeyPressEvent(e, isValidCB, onKeyPressCB) {
    if (isValidCB && !isValidCB(e.key)) {
        e.preventDefault();
        return;
    }
    onKeyPressCB && onKeyPressCB(e);
}

const FormEvents = { onChangeEvent, onBlurEvent, onKeyPressEvent };

export default FormEvents;
