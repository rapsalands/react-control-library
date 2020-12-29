const n = /^[0-9]*$/;
const Regex = {
    phone: () => ['(', n, n, n, ')', ' ', n, n, n, '-', n, n, n, n],
    zipcode: () => [n, n, n, n, n],
    ssn: () => [n, n, n, '-', n, n, '-', n, n, n, n],
    paymentCard: () => [n, n, n, n, " ", n, n, n, n, " ", n, n, n, n, " ", n, n, n, n]
};

export default Regex;
