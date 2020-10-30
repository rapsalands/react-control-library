import React from 'react';
import './App.css';
import AlphaNumeric from './components/form/controls/alphaNumeric';
import DecimalInput from './components/form/controls/decimalInput';
import Email from './components/form/controls/email';
import MaskedInput from './components/form/controls/maskedInput';
import NumberInput from './components/form/controls/numberInput';
import Password from './components/form/controls/password';
import SecureMaskedInput from './components/form/controls/secureMaskedInput';
import TextInput from './components/form/controls/textInput';
import Regex from './components/form/regex';

function App() {

  const [ssn, setSsn] = React.useState('8767867576565');
  const [temp, setTemp] = React.useState(98798);

  function changeEvent(e) {
    console.log(e.detail);
  }

  return (
    <React.Fragment>
      <div>
        Text Field <TextInput restrictSymbols='~!@#$%' value={ssn} onChange={(e: any) => setSsn(e.target.value)} label='Person Name' />
      </div>
      <div>
        Number <NumberInput max={2000} min={500} minLength={3} onChange={changeEvent} />
      </div>
      <div>
        Decimal <DecimalInput decimalLimit={5} value={temp} onChange={(e: any) => setTemp(e.target.value)} />
      </div>
      <div>
        AlphaNumeric <AlphaNumeric onBlur={(e: any) => { setSsn(e.target.value); setTemp(e.target.value) }} />
      </div>
      <div>
        Email <Email required onBlur={(e: any) => console.log(e.detail)} />
      </div>
      <div>
        Password <Password onChange={changeEvent} />
      </div>
      <div>
        Phone Input <MaskedInput mask={Regex.phone()} onChange={changeEvent} />
      </div>
      <div>
        ZipCode Input <MaskedInput mask={Regex.zipcode()} onChange={changeEvent} />
      </div>
      <div>
        SSN Input <SecureMaskedInput secure={{ getValue: (data) => `***${data}` }} value={ssn} mask={Regex.ssn()} onChange={(e: any) => setSsn(e.target.value)} />
      </div>
    </React.Fragment>
  );
}

export default App;
