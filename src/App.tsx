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
import TextInput from './components/form/controls/textInput';
import Regex from './regex';
import SecureMaskedInput from './components/form/controls/secureMaskedInput';
import ReadMeExample from './ReadmeExample';
import NumberMask from './components/form/controls/numberMask';
import { INumberMask } from './components/shared/interfacesDelegates/controlInterfaces';
import ReadMeNumberMaskDemo from './readme/numberMask';

function App() {

  const [numMask, setNumMask] = React.useState('750qwe');
  const [num, setNum] = React.useState('435qwe');
  const [ssn, setSsn] = React.useState();
  const [temp, setTemp] = React.useState(98798);
  const [gender, setGender] = React.useState('male');
  const [isInternational, setIsInternational] = React.useState(false);

  function getPhoneMask() {
    const n = /^[0-9]*$/;
    return isInternational
      ? ["+", n, n, n, n, n, n, n, n, n, n]
      : ["(", n, n, n, ")", " ", n, n, n, "-", n, n, n, n];
  }

  function changeEvent(e) {
    console.log(e.detail);
    const f = e.detail.metadata.find(n => n.attribute === 'strength');
    console.log(f?.metadata?.strength);
  }

  function numChangeEvent(e) {
    setNum(e.target.value);
    console.log(e.detail);
  }

  return (
    <React.Fragment>
      <ReadMeNumberMaskDemo />
      <ReadMeExample />
      <div>
        Currency Number Mask <NumberMask value={numMask}
          onChange={(e: any) => {
            setNumMask(e.target.value);
            console.log(e.detail);
          }}
          min={100}
          max={200000}
          mask={{
            suffix: '#',
            thousandsSeparatorSymbol: ',',
            negativeAllowed: true
          } as INumberMask}
        />
      </div>
      <div>
        Percentage Number Mask <NumberMask
          onChange={changeEvent}
          max={1000}
          min={100}
          mask={{
            prefix: '',
            suffix: '%',
            decimalLimit: 4,
            negativeAllowed: true
          } as INumberMask} />
      </div>
      <div>
        Text Field <TextInput restrictSymbols='~!@#$%' value={ssn} onChange={(e: any) => { setSsn(e.target.value); changeEvent(e); }} label='Person Name' />
      </div>
      <div>
        Number <NumberInput value={num} onChange={numChangeEvent} />
      </div>
      <div>
        Decimal <DecimalInput max={100} maxLength={6} decimalLimit={2} value={temp} onChange={(e: any) => { setTemp(e.target.value); changeEvent(e); }} />
      </div>
      <div>
        AlphaNumeric <AlphaNumeric allowSymbols='~!#$%^&*()_+?-=<>/' onBlur={(e: any) => { setSsn(e.target.value); setTemp(e.target.value) }} />
      </div>
      <div>
        Email <Email required pattern='^[^@\s]+@[^@\s\.]+\.[^@\.\s]+$' onBlur={(e: any) => console.log(e.detail)} onChange={changeEvent} />
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
      </div>
      <div>
        SSN Input <SecureMaskedInput secure={{
          getValue: (detail, data) => {
            if (detail.value.length < 10) {
              return data;
            }
            return isInternational
              ? `+******${detail.value.substring(6, 10)}`
              : `(***) ***-${detail.value.substring(6, 10)}`;
          }
        }} value={ssn} mask={getPhoneMask()} onChange={(e: any) => { setSsn(e.target.value); changeEvent(e) }} onBlur={changeEvent} />
        <br />
        <button onClick={() => setIsInternational(!isInternational)}>Toggle Mask</button>
        <br />
        Value: {ssn}, Mask: {isInternational ? 'Internaltional' : 'Normal'}
      </div>
      <div>
        Gender
        <RadioButton id='maleId' name='gender' label='Male' placeholder='One' checked={gender === 'male'} onChange={_ => setGender('male')} />
        <RadioButton name='gender' label='Female' placeholder='Two' checked={gender === 'female'} onChange={_ => setGender('female')} />
      </div>
      <div>
        Yes/No
        <Checkbox1 id='c1' label='Check 1' indeterminate={gender === 'male'} />
        <Checkbox1 id='c2' indeterminate={gender === 'male'}>Check 2</Checkbox1>
        <Checkbox1 id='c3' label='Check 3' indeterminate={gender === 'male'} />
        <Checkbox1 id='c4' label='Check 4' indeterminate={gender === 'male'} />
      </div>
      <div>
        <button onClick={() => {
          setNum('500');
        }}>Click</button>
      </div>
    </React.Fragment>
  );
}

export default App;
