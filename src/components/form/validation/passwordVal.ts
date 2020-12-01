import Constants from "../../shared/constants";
import { IPasswordCriteria, IPasswordFailure } from "../../shared/interfacesDelegates/controlnterfaces";
import { IDetail } from "../../shared/interfacesDelegates/eventInterfaces";
import Messages from "../../shared/messages";
import { DetailIns, PasswordFailIns } from "../formPropsIns";

function isPasswordValid(data: any, passwordCriteria: IPasswordCriteria): IDetail {

    data = data || '';

    const addPassFail = (key, message: any = null) => result.push(new PasswordFailIns(key, data, message));
    const validRange = (data, start, end) => data >= start && data <= end;
    const validSymbols = (data) => {
        const syms = Constants.ascii.symbols;
        return syms.includes(data);
    }

    function validate(toCompare, key, messageFunc, start, end, checkRange = true) {

        if (!toCompare) return;
        data = data || '';

        let count = 0;

        for (let i = 0; i < data.length; i++) {
            const el = checkRange ? data.charCodeAt(i) : data[i];
            const validFunc = checkRange ? validRange : validSymbols;
            const t = validFunc(el, start, end) ? 1 : 0;
            count += t;
        }

        if (count < toCompare) addPassFail(key, messageFunc(toCompare));
    }

    function checkSequence(key, start, end, toCompare, message) {
        let count = 0, nextEl = -1;
        for (let i = 0; i < data.length; i++) {
            const el = data.charCodeAt(i);

            if (count === 0) {
                if (validRange(el, start, end)) {
                    nextEl = el + 1;
                    count++;
                }
                else count = 0;
            }
            else {
                if (el === nextEl) {
                    nextEl++;
                    count++;
                }
            }

            if (count > toCompare) addPassFail(key, message);
        }
    }

    const result: IPasswordFailure[] = [];

    if (!data) {
        addPassFail('required', data);
        return new DetailIns(null, data, false, 'required', result);
    }
    const pc = passwordCriteria;
    const passMess = Messages.password;
    const ascii = Constants.ascii;

    if (pc.minLength && data.length < pc.minLength) addPassFail('minLength', passMess.minLength(pc.minLength));
    if (pc.maxLength && data.length > pc.maxLength) addPassFail('maxLength', passMess.maxLength(pc.maxLength));

    validate(pc.capital, 'capital', passMess.capital, ascii.A, ascii.Z);
    validate(pc.numberCount, 'numberCount', passMess.numberCount, ascii.zero, ascii.nine);
    validate(pc.symbols, 'symbols', passMess.symbols, 0, 0, false);

    checkSequence(Constants.attributes.numberSeq, ascii.zero, ascii.nine, pc.sequence?.number, passMess.numberSeq(pc.sequence?.number));
    checkSequence(Constants.attributes.characterSeq, ascii.a, ascii.z, pc.sequence?.characters, passMess.characterSeq(pc.sequence?.characters));

    const passwordStrength = checkPassStrength(data);
    result.push(new PasswordFailIns('strength', data, '', passwordStrength));

    return new DetailIns(null, data, !result.length, null, result);
}

// Referred from: https://stackoverflow.com/a/11268104/815600
function checkPassStrength(password): { score: number, strength: PasswordStrength } {

    function scorePassword(password): number {
        let score = 0;
        if (!password)
            return score;

        // award every unique letter until 5 repetitions
        const letters = {};
        for (let i = 0; i < password.length; i++) {
            letters[password[i]] = (letters[password[i]] || 0) + 1;
            score += 5.0 / letters[password[i]];
        }

        // bonus points for mixing it up
        const variations = {
            digits: /\d/.test(password),
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            nonWords: /\W/.test(password),
        }

        let variationCount = 0;
        for (let check in variations) {
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;

        return score;
    }

    const score = scorePassword(password);
    let strength = PasswordStrength.VeryWeak;
    if (score > 90)
        strength = PasswordStrength.VeryStrong;
    else if (score > 75)
        strength = PasswordStrength.Strong;
    else if (score > 60)
        strength = PasswordStrength.Strong;
    else if (score >= 30)
        strength = PasswordStrength.Weak;

    return { score, strength };
}

enum PasswordStrength {
    VeryStrong = 'VeryStrong',
    Strong = 'Strong',
    Good = 'Good',
    Weak = 'Weak',
    VeryWeak = 'VeryWeak',
}

const passwordVal = { PasswordStrength, isPasswordValid };

export default passwordVal;
