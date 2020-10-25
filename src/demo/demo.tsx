import { TextField } from '@material-ui/core';
import React from 'react';
import AlphaNumeric from '../components/form/controls/alphaNumeric';
import DecimalInput from '../components/form/controls/decimalInput';
import Email from '../components/form/controls/email';
import MaskedInput from '../components/form/controls/maskedInput';
import NumberInput from '../components/form/controls/numberInput';
import Password from '../components/form/controls/password';
import TextInput from '../components/form/controls/textInput';
import Regex from '../components/form/regex';

const Dashboard = () => {

    function changeEvent(e) {
        console.log(e.detail);
    }

    return (
        <React.Fragment>

            Text Field <TextInput restrictSymbols='~!@#$%' label='Person Name' />
            Number <NumberInput max={2000} min={500} minLength={3} inputTag={TextField} onChange={changeEvent} />
            Decimal <DecimalInput decimalLimit={5} />
            AlphaNumeric <AlphaNumeric />
            Email <Email required onBlur={(e: any) => console.log(e.detail)} />
            Password <Password onChange={changeEvent} />
            Phone Input <MaskedInput mask={Regex.phone()} onChange={changeEvent} />
            ZipCode Input <MaskedInput mask={Regex.zipcode()} onChange={changeEvent} />
        </React.Fragment>
    );
};

export default Dashboard;
