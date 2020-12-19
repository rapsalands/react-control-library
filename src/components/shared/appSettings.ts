import { PasswordCriteriaIns } from "../form/formPropsIns";
import { IPasswordCriteria } from "./interfacesDelegates/controlnterfaces";

const AppSettings = {
    defaultPasswordCriteria: () => {
        //constructor(capital: number = 1, minLength: number = 8, maxLength: number = 0, numberCount: number = 1, symbols: number = 1, restrictSymbols: string = '', sequence: { number: number, characters: number } | null = null)

        //return new PasswordCriteriaIns(1, 8, 0, 1, 1, '', { number: 5, characters: 5 });
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
    decimal: {
        maxLength: 20,
        decimalLimit: 4
    }
};

export default AppSettings;
