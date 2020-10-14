import React from 'react';
import AlphaNumeric from '../form/controls/alphaNumeric';
import CustomInput from '../form/controls/customInput';
import DecimalInput from '../form/controls/decimalInput';
import Email from '../form/controls/email';
import NumberInput from '../form/controls/numberInput';
import TextInput from '../form/controls/textInput';

const Dashboard = () => {
    return (
        <React.Fragment>
            Text <TextInput restrictSymbols='~!@#$%' pattern='^\d+$' />
            Number <NumberInput />
            Decimal <DecimalInput decimalLimit={5} />
            AlphaNumeric <AlphaNumeric />
            Email <Email />
            Password <CustomInput type='password' />
        </React.Fragment>
    );
};

export default Dashboard;
