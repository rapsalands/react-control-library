import { DetailIns } from "../formPropsIns";
import { IDetail } from "../../shared/interfacesDelegates/eventInterfaces";
import { validateDelegate } from "../../shared/interfacesDelegates/delegates";
import { ValidationType } from "../../shared/enumerations";
import { IValidationProps } from "../../shared/interfacesDelegates/controlInterfaces";

function alwaysValid(data: any): IDetail {
    return new DetailIns(null, data, true, null, null);
}

function has2Validate(validation: IValidationProps, validType: ValidationType) {
    return !validation.skipValidationTypes.includes(validType);
}

const general: validateDelegate = (validation, detail, data, props): IDetail => {

    const isValidAttr = (validType: ValidationType) => has2Validate(validation, validType);

    props = props || {};
    data = data || '';

    if (!data) {
        if (isValidAttr(ValidationType.required) && props.required) {
            return new DetailIns(detail, data, false, 'required');
        }
        return new DetailIns(detail, data, true, null);
    }

    if (isValidAttr(ValidationType.minLength) && props.minLength && data && props.minLength > data.length) {
        return new DetailIns(detail, data, false, 'minLength');
    }

    if (isValidAttr(ValidationType.exactLength) && props.exactLength && data && props.exactLength > data.length) {
        return new DetailIns(detail, data, false, 'exactLength');
    }

    if (isValidAttr(ValidationType.min) && props.min && +props.min > +data) {
        return new DetailIns(detail, data, false, 'min');
    }

    return new DetailIns(detail, data, true, null);
}
const forRestriction: validateDelegate = (validation, detail, value, props): IDetail => {

    const isValidAttr = (validType: ValidationType) => has2Validate(validation, validType);

    props = props || {};
    value = value || '';

    if (!value) {
        return new DetailIns(detail, value, true, null);
    }

    if (isValidAttr(ValidationType.maxLength) && props.maxLength && value && props.maxLength < value.length) {
        return new DetailIns(detail, value, false, 'maxLength');
    }

    if (isValidAttr(ValidationType.max) && props.max && +props.max < +value) {
        return new DetailIns(detail, value, false, 'max');
    }

    if (isValidAttr(ValidationType.pattern) && props.pattern && !(new RegExp(props.pattern).test(value))) {
        return new DetailIns(detail, value, false, 'pattern');
    }

    return new DetailIns(detail, value, true, null);
}

const formVali = { alwaysValid, forRestriction, general };

export default formVali;
