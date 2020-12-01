import { PasswordCriteriaIns } from "../form/formPropsIns";

const AppSettings = {
    defaultPasswordCriteria: () => {
        return new PasswordCriteriaIns(1, 8, 0, 1, 1, '', { number: 5, characters: 5 });
    },
    decimal: {
        maxLength: 20
    }
};

export default AppSettings;
