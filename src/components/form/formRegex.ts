function modRegex(originalRegex, symbols: string | number = '', temp = 'SPECIAL') {
    let regex = originalRegex.source || originalRegex;
    regex = regex.replace(temp, symbols);
    return regex;
}

const FormRegex = {
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
    }
};

export default FormRegex;
