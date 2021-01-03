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

/**
 * Perform validation for user input. Validation result will included in e.detail property.
 * Max validation will be performed only if value is less than zero. Else max will be performed in forRestriction validation.
 * @param validation validation settings sent by user.
 * @param detail detail of control.
 * @param value value entered in control.
 * @param props control entire props object.
 */
const general: validateDelegate = (validation, detail, value, props): IDetail => {

    const isValidAttr = (validType: ValidationType) => has2Validate(validation, validType);

    props = props || {};
    value = value || '';

    if (!value) {
        if (isValidAttr(ValidationType.required) && props.required) {
            return new DetailIns(detail, value, false, 'required');
        }
        return new DetailIns(detail, value, true, null);
    }

    if (isValidAttr(ValidationType.minLength) && props.minLength && value && props.minLength > value.length) {
        return new DetailIns(detail, value, false, 'minLength');
    }

    if (isValidAttr(ValidationType.exactLength) && props.exactLength && value && props.exactLength > value.length) {
        return new DetailIns(detail, value, false, 'exactLength');
    }

    if (isValidAttr(ValidationType.min) && props.min && +props.min > +value) {
        return new DetailIns(detail, value, false, 'min');
    }

    if (isValidAttr(ValidationType.max) && props.max && +props.max < +value && (+value < 0)) {
        return new DetailIns(detail, value, false, 'max');
    }

    return new DetailIns(detail, value, true, null);
}

/**
 * Perform validation for user input. If validations fails, then user input is restricted (not entered).
 * Max validation will be performed only if value is greater than zero. Else max will be included in general validation.
 * @param validation validation settings sent by user.
 * @param detail detail of control.
 * @param value value entered in control.
 * @param props control entire props object.
 */
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

    if (isValidAttr(ValidationType.max) && props.max && +props.max < +value && (+value > 0)) {
        return new DetailIns(detail, value, false, 'max');
    }

    if (isValidAttr(ValidationType.pattern) && props.pattern && !(new RegExp(props.pattern).test(value))) {
        return new DetailIns(detail, value, false, 'pattern');
    }

    return new DetailIns(detail, value, true, null);
}

const formVali = { alwaysValid, forRestriction, general };

export default formVali;
