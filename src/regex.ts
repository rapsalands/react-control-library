const num = /^[0-9]*$/;

const Regex = {
    phone: () => ['(', num, num, num, ')', ' ', num, num, num, '-', num, num, num, num],
    zipcode: () => [num, num, num, num, num],
    ssn: () => [num, num, num, '-', num, num, '-', num, num, num, num],
};

export default Regex;
