import typeUtility from "../../shared/typeUtility";

function modRegex(originalRegex, symbols: string | number = '', temp = 'SPECIAL') {
    let regex = originalRegex.source || originalRegex;
    regex = regex.replace(temp, symbols);
    return regex;
}

function pureValue(data: string, mask: any[]): string {
    const regexes: any[] = mask.filter(n => typeUtility.isRegex(n));
    let result = '';

    let di = 0;
    for (let ri = 0; (ri < regexes.length && di < data.length); ri++) {
        const regex = regexes[ri] as RegExp;
        const val = data[di];

        if (regex.test(val)) {
            result += val;
        } else {
            ri--;
        }
        di++;
    }

    return result;
}

const num = /^[0-9]*$/;

const Regex = {
    number: () => /^\d+$/,
    decimal: (decimalLimit = 2, maxLength = 20) => {
        const regex = /^-?[0-9]{0,10}(\.[0-9]{0,2})?$/;
        maxLength = maxLength - decimalLimit;
        let modified = modRegex(regex, maxLength, '10');
        modified = modRegex(modified, decimalLimit, '2');
        return new RegExp(modified);
    },
    custom: (allowSymbols) => {
        return new RegExp(modRegex(/^[SPECIAL]*$/, allowSymbols));
    },
    alphaNumeric: (allowSymbols = '') => {
        return new RegExp(modRegex(/^[A-Za-z0-9SPECIAL]*$/, allowSymbols));
    },
    email: () => {
        // Taken from https://www.w3resource.com/javascript/form/email-validation.php
        // RFC 2822 standard email validation
        // eslint-disable-next-line
        const regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return regex;
    },
    phone: () => ['(', num, num, num, ')', ' ', num, num, num, '-', num, num, num, num],
    zipcode: () => [num, num, num, num, num],
    ssn: () => [num, num, num, '-', num, num, '-', num, num, num, num],
    pureValue: pureValue
};

export default Regex;
