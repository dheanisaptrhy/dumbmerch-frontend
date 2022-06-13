import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from './pages/Landing'
import UserShop from './pages/UserShop';
import DetailPage from './pages/DetailPage';
import Profile from './pages/Profile';
import ProductList from './pages/ProductList';
import CategoryList from './pages/CategoryList';
import EditProduct from './pages/EditProduct';
import EditCategory from './pages/EditCategory';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import ChatUser from './pages/ChatUser';
import ChatSeller from './pages/ChatSeller';
import { useContext, useEffect } from 'react';
import { UserContext } from './context/UserContext';

import { API, setAuthToken } from './config/api'
import EditProfile from './pages/EditProfile';
function App() {
  const navigate = useNavigate()
  const [state, dispatch] = useContext(UserContext)

  useEffect(() => {
    if(localStorage.token){
      setAuthToken(localStorage.token)
    }

    // redirect auth
    if (!state.isLogin) {
      navigate('/')
    } else {
      if (state.user.status == "admin") {
        navigate('/product')
      } else if (state.user.status == "customer") {
        navigate('/home')
      }
    }
  }, [state])

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth')

      if (response.status === 404) {
        return dispatch({
          type: 'AUTH ERROR'
        })
      }

      let payload = response.data.data.user
      payload.token = localStorage.token

      dispatch({
        type: "USER SUCCESS",
        payload
      })
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
  }, [])

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route exact path="/home" element={<UserShop />} />
        <Route exact path="/detailpage/:id" element={<DetailPage />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/editprofile/:id" element={<EditProfile />} />
        <Route exact path="/product" element={<ProductList />} />
        <Route exact path="/category" element={<CategoryList />} />
        <Route exact path="/editproduct/:id" element={<EditProduct />} />
        <Route exact path="/editcategory/:id" element={<EditCategory />} />
        <Route exact path="/addproduct" element={<AddProduct />} />
        <Route exact path="/addcategory" element={<AddCategory />} />
        <Route exact path="/chatuser" element={<ChatUser />} />
        <Route exact path="/chatseller" element={<ChatSeller />} />
      </Routes>
    </>
  );
}

export default App;
