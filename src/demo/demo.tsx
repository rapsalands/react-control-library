import { TextField } from '@material-ui/core';
import React from 'react';
import AlphaNumeric from '../components/form/controls/alphaNumeric';
import CustomInput from '../components/form/controls/customInput';
import DecimalInput from '../components/form/controls/decimalInput';
import Email from '../components/form/controls/email';
import NumberInput from '../components/form/controls/numberInput';
import TextInput from '../components/form/controls/textInput';
import DemoControlSection from './demoControlSection';
import TextParams from './params/textParams';

const Dashboard = () => {
    return (
        <React.Fragment>

            {/* <DemoControlSection params={TextParams} control={TextInput} detail={null} /> */}

            Text Field <TextInput restrictSymbols='~!@#$%' label='Person Name' />
            Number <NumberInput min={500} minLength={3} inputTag={TextField} onChange={(e: any) => console.log(e.detail)} />
            Decimal <DecimalInput decimalLimit={5} />
            AlphaNumeric <AlphaNumeric />
            Email <Email required onBlur={(e: any) => console.log(e.detail)} />
            Password <CustomInput type='password' />
        </React.Fragment>
    );
};

export default Dashboard;
