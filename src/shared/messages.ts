const Messages = {
    password: {
        capital: (count) => `Password must have atleast ${count} capital letter(s).`,
        numberCount: (count) => `Password must have atleast ${count} number(s).`,
        minLength: (count) => `Password must be of atleast ${count} length.`,
        maxLength: (count) => `Password must be at max ${count} in length.`,
        symbols: (count) => `Password must have at least ${count} symbol(s).`,
        restrictSymbols: (count) => `Password cannot contain ${count} character(s).`,
        numberSeq: (count) => `Password cannot have continuous ${count} number(s).`,
        characterSeq: (count) => `Password cannot have continuous ${count} character(s).`,
    }
};

export default Messages;
