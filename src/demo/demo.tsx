import { TextField } from '@material-ui/core';
import React from 'react';
import AlphaNumeric from '../components/form/controls/alphaNumeric';
import DecimalInput from '../components/form/controls/decimalInput';
import Email from '../components/form/controls/email';
import NumberInput from '../components/form/controls/numberInput';
import Password from '../components/form/controls/password';
import TextInput from '../components/form/controls/textInput';

const Dashboard = () => {
    return (
        <React.Fragment>

            Text Field <TextInput restrictSymbols='~!@#$%' label='Person Name' />
            Number <NumberInput max={2000} min={500} minLength={3} inputTag={TextField} onChange={(e: any) => console.log(e.detail)} />
            Decimal <DecimalInput decimalLimit={5} />
            AlphaNumeric <AlphaNumeric />
            Email <Email required onBlur={(e: any) => console.log(e.detail)} />
            Password <Password />
        </React.Fragment>
    );
};

export default Dashboard;
