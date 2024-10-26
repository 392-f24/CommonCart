// import { useAuthState } from './utilities/firebase';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './pages/SignIn';
import { useAuthState } from './utilities/firebase';
import './App.css';

import Navigationbar from './components/Navigation';
import CartPage from './Pages/cartPage';
import ReceiptPage from './Pages/receiptPage';


const App = () => {
  const [user, loading, error] = useAuthState(); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Handle error if authentication fails
  }

  return (
    <Router>
      <div className="App-header">
        {/* If user is authenticated, show Header, Navbar, and Routes, else show SignInPage */}
        {!user ? (
          <SignIn />
        ) : (
          <>
            <div className="content flex-grow"> 
              <Routes>
                <Route path="/" element={<CartPage />} />
                <Route path="/receipts" element={<ReceiptPage />} />
                {/* <Route path="/profile" element={<ProfilePage />} /> */}

              </Routes>
            </div>
            <div>
              <Navigationbar /> 
            </div>
          </>
        )}
      </div>
    </Router>
  ); 
};

export default App;