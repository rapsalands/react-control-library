import { INumberMask, IPasswordCriteria } from "./interfacesDelegates/controlInterfaces";

const AppSettings = {
    defaultPasswordCriteria: () => {
        return {
            capital: 1,
            minLength: 8,
            maxLength: 0, // Means no restriction
            numberCount: 1,
            symbols: 1,
            restrictSymbols: '',
            sequence: {
                number: 5,
                characters: 5
            }
        } as IPasswordCriteria;
    },
    defaultNumberMask: () => {
        return {
            prefix: '$',
            suffix: '',
            thousandsSeparatorSymbol: ',',
            decimalSymbol: '.',
            decimalLimit: 4,
            maxLength: 20,
            negativeAllowed: false,
        } as INumberMask;
    },
    decimal: {
        maxLength: 20,
        decimalLimit: 4
    },
    error: {
        defaultControlError: 'rcl-control-error'
    }
};

export default AppSettings;
