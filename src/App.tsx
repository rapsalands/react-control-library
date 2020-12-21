import Checkbox1 from './components/form/controls/checkbox';
import React from 'react';
import './App.css';
import AlphaNumeric from './components/form/controls/alphaNumeric';
import DecimalInput from './components/form/controls/decimalInput';
import Email from './components/form/controls/email';
import MaskedInput from './components/form/controls/maskedInput';
import NumberInput from './components/form/controls/numberInput';
import Password from './components/form/controls/password';
import RadioButton from './components/form/controls/radioButton';
import SecureInput from './components/form/controls/secureInput';
import TextInput from './components/form/controls/textInput';
import Regex from './regex';

function App() {

  const [num, setNum] = React.useState('435qwe');
  const [ssn, setSsn] = React.useState('');
  const [temp, setTemp] = React.useState(98798);
  const [gender, setGender] = React.useState('male');
  const [yesNo, setYesNo] = React.useState(false);

  function changeEvent(e) {
    console.log(e.detail);
  }

  function numChangeEvent(e) {
    setNum(e.target.value);
    console.log(e.detail);
  }

  return (
    <React.Fragment>
      {/* <div>
        Text Field <TextInput restrictSymbols='~!@#$%' value={ssn} onChange={(e: any) => { setSsn(e.target.value); changeEvent(e); }} label='Person Name' />
      </div>
      <div>
        Number <NumberInput value={num} onChange={numChangeEvent} />
      </div>
      <div>
        Decimal <DecimalInput maxLength={10} value={temp} onChange={(e: any) => { setTemp(e.target.value); changeEvent(e); }} />
      </div>
      <div>
        AlphaNumeric <AlphaNumeric onBlur={(e: any) => { setSsn(e.target.value); setTemp(e.target.value) }} />
      </div>
      <div>
        Email <Email required onBlur={(e: any) => console.log(e.detail)} onChange={changeEvent} />
      </div>
      <div>
        Password <Password onChange={changeEvent} />
      </div>
      <div>
        Phone Input
        {
          // @ts-ignore
          <MaskedInput mask={Regex.phone()} value={'750'} onChange={changeEvent} exactLength={9} />
        }
      </div>
      <div>
        ZipCode Input <MaskedInput mask={Regex.zipcode()} onChange={changeEvent} />
      </div> */}
      <div>
        SSN Input <SecureInput secure={{
          getValue: (detail, data) => {
            if (!detail || !detail.value) return data;
            if (detail.value.length >= 9) return `***-**-${detail.value.substring(detail.value.length - 4, detail.value.length)}`;

            return data;
          }
        }} value={ssn} mask={Regex.ssn()} onChange={(e: any) => { setSsn(e.target.value); changeEvent(e) }} onBlur={changeEvent} />
      </div>
      {/* <div>
        Gender
        <RadioButton name='gender' placeholder='One' checked={gender === 'male'} onChange={_ => setGender('male')} />
        <RadioButton name='gender' placeholder='Two' checked={gender === 'female'} onChange={_ => setGender('female')} />
      </div>
      <div>
        Yes/No
        <Checkbox1 indeterminate={gender === 'male'} />
      </div>
      <div>
        <button onClick={() => {
          setNum('500');
        }}>Click</button>
      </div> */}
    </React.Fragment>
  );
}

export default App;
