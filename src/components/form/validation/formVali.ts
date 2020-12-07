import { DetailIns } from "../formPropsIns";
import { IDetail } from "../../shared/interfacesDelegates/eventInterfaces";

function alwaysValid(data: any): IDetail {
    return new DetailIns(null, data, true, null, null);
}

function general(detail: IDetail | null, data: any, props: any): IDetail {
    props = props || {};
    data = data || '';

    if (!data) {
        if (props.required) {
            return new DetailIns(detail, data, false, 'required');
        }
        return new DetailIns(detail, data, true, null);
    }

    if (props.minLength && data && props.minLength > data.length) {
        return new DetailIns(detail, data, false, 'minLength');
    }

    if (props.exactLength && data && props.exactLength > data.length) {
        return new DetailIns(detail, data, false, 'exactLength');
    }

    if (props.min && +props.min > +data) {
        return new DetailIns(detail, data, false, 'min');
    }

    return new DetailIns(detail, data, true, null);
}

function forRestriction(detail: IDetail | null | undefined, value: any, props: any): IDetail {
    props = props || {};
    value = value || '';

    if (!value) {
        return new DetailIns(detail, value, true, null);
    }

    if (props.maxLength && value && props.maxLength < value.length) {
        return new DetailIns(detail, value, false, 'maxLength');
    }

    if (props.max && +props.max < +value) {
        return new DetailIns(detail, value, false, 'max');
    }

    if (props.pattern && !(new RegExp(props.pattern).test(value))) {
        return new DetailIns(detail, value, false, 'pattern');
    }

    return new DetailIns(detail, value, true, null);
}

const formVali = { alwaysValid, forRestriction, general };

export default formVali;
