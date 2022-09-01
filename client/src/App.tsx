import { Routes, Route } from "react-router-dom";
import "./assets/scss/style.scss";
import "./assets/scss/reset.css";
import { Home } from "./pages/Home/Home";
import { Favorite } from "./pages/Favorite/Favorite.tsx";
import { Catalog } from "./pages/Catalog/index.tsx";
import { Detail } from "./pages/Detail/index.tsx";
import { AccountInfo } from "./pages/AccountInfo/index.tsx";
import { Registration } from "./pages/Authorization/Registration.tsx";
import { Login } from "./pages/Authorization/Login.tsx";
import { useEffect, useState } from "react";
import { useAppDispatch,useAppSelector } from "./hooks.ts";
import { isAuth } from "./http/userAPI.ts";
import { setAuth } from "./app/slices/userSlice.ts";
import jwt_decode from "jwt-decode";
import { getUserByIdChunck } from "./app/slices/userSlice.ts";
import { Admin } from "./pages/Admin/index.tsx";
import { AddProduct } from "./pages/AddProduct/index.tsx";
import { getProductsThunk } from "./app/slices/productsListSlice.ts";
import Loader from "./components/Loader/index.tsx";
import { getFavorListThunk } from "./app/slices/productsListSlice.ts";
import { ShowUsers } from "./pages/ShowUsers/ShowUsers.tsx";
import {getUsersThunk} from './app/slices/userSlice.ts';
import { useSelector } from "react-redux";


function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const isAuths = useAppSelector(s=>s.user.isAuth)
  const user = useAppSelector(s=>s.user);


  useEffect(() => {
    dispatch(getUsersThunk());
    dispatch(getProductsThunk())
    .then(() => {
      isAuth()
        .then(() => {
          dispatch(setAuth(true));
        })
        .then(() => {
          const id = jwt_decode<any>(String(localStorage.getItem("token")))?.id;
          if (id) {
               dispatch(getUserByIdChunck(id)).then(()=>{
               dispatch(getFavorListThunk(id))
            })
          }
        })
        .finally(() => {
          setLoading(false);
        })
        ;
    }).catch((err:any) => {
      console.log('Server error ...');
      alert(err)
    });
    
    
  }, [isAuths]);

  if (loading) {
    return (
      <section>
        <Loader />
      </section>
    );
  }

 

  return (
    <div className="App">
      <Routes>
        <Route exact path="/catalog/:category/:id" element={<Detail />} />
        <Route
          exact
          path="/catalog/:category/subcategory/:subcategory"
          element={<Catalog />}
        />
         <Route
          exact
          path="/favorites/:category/subcategory/:subcategory"
          element={<Favorite />}
        />
        <Route exact path="/favorites/:category/:id" element={<Detail />} />
        <Route exact path="/catalog/:category" element={<Catalog />} />
        <Route exact path="/catalog" element={<Catalog />} />
        <Route exact path="/favorites/:category" element={<Favorite />} />
        <Route exact path="/favorites" element={<Favorite />} />
        <Route exact path="/account" element={<AccountInfo />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/registration" element={<Registration />} />
        <Route exact path="/admin" element={<Admin />} />
        <Route exact path="/admin/addProduct" element={<AddProduct />} />
        <Route exact path="/admin/showUsers" element={<ShowUsers />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
