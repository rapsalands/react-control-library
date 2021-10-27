import React from 'react';
import NumberMask from '../components/form/controls/numberMask';

const App = () => {

    const [data, setData] = React.useState('');



    
    function getNumberMask() {
        return {
            prefix: '$',
            suffix: '',
            thousandsSeparatorSymbol: ',',
            decimalSymbol: '.',
            decimalLimit: 4,
            maxLength: 20,
            negativeAllowed: false,
        };
    }

    return (
        <React.Fragment>
            Enter USD: <NumberMask mask={getNumberMask()} value={data} onChange={(e: any) => setData(e.target.value)} />
        </React.Fragment>
    );
};

export default App;
