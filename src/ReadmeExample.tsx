import React from 'react';
import SecureMaskedInput from './components/form/controls/secureMaskedInput';

const App = () => {

    const ssnMask = [/^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, '-', /^[0-9]*$/, /^[0-9]*$/, '-', /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/, /^[0-9]*$/];

    const [ssn, setSsn] = React.useState('');

    return (
        <SecureMaskedInput
            mask={ssnMask}
            value={ssn}
            onChange={(e: any) => setSsn(e.target.value)}
            secure={{
                getValue: (detail, ssnValue) => {
                    return '***-HIDDEN';
                }
            }}
        />
    );
};

export default App;
