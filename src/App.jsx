//App.jsx
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './App.css';

import Navigationbar from './components/Navigation';
import CartPage from './components/pages/cartPage';
import ReceiptPage from './components/pages/receiptPage';


const App = () => {

  return (
    <Router>
      <div className="App-header">

          <>
            <div className="content flex-grow"> 
              <Routes>
                <Route path="/" element={<CartPage />} />
                <Route path="/receipts" element={<ReceiptPage />} />
              </Routes>
            </div>
            <div>
              <Navigationbar /> 
            </div>
          </>

      </div>
    </Router>
  );
};

export default App;
