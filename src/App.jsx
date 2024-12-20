import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import SignIn from './Pages/SignIn';
import { useAuthState } from './utilities/firebase';
import './App.css';

import Navigationbar from './components/Navigation';
import CartPage from './Pages/CartPage';
import SummariesPage from './Pages/SummariesPage';
import GoShoppingPage from './Pages/GoShoppingPage';
import ShoppingListPage from './Pages/ShoppingListPage';
import CheckList from './components/CheckList';
import ConfirmUserPage from './Pages/ConfirmUserPage';

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
                <Route path="/summaries" element={<SummariesPage />} />
                <Route path="/go-shopping" element={<GoShoppingPage />}/>
                <Route path="/cart/:title" element={<ShoppingListPage />} />
                <Route path="/go-shopping/checklist" element={<CheckList />} />
                <Route path="/confirm" element={<ConfirmUserPage />} />
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