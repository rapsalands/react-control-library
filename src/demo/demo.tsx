import React from 'react';
import AlphaNumeric from '../components/form/controls/alphaNumeric';
import CustomInput from '../components/form/controls/customInput';
import DecimalInput from '../components/form/controls/decimalInput';
import Email from '../components/form/controls/email';
import NumberInput from '../components/form/controls/numberInput';
import TextInput from '../components/form/controls/textInput';

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
