import React, { useState } from "react";
import ms from "./style.module.scss";
import logo from "../../assets/images/basket.png";
import title from "../../assets/images/title.png";
import search from "../../assets/images/search.png";
import user from "../../assets/images/user.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setText } from "../../app/slices/searchSlice.ts";
import { useEffect } from "react";
import { CloudMessage } from "../CloudMessage/index.tsx";
import jwt_decode from "jwt-decode";

import { setActive } from "../../app/slices/navBarSlice.ts";
import { getProductsThunk } from "../../app/slices/productsListSlice.ts";
import {
  setAuth,
} from "../../app/slices/userSlice.ts";
import { getUserByIdChunck } from "../../app/slices/userSlice.ts";

const Header = () => {
  const avatar = useSelector((s) => s.user.userData.avatar);
  const isAuth = useSelector((s) => s.user?.isAuth);
  const [isActiveCloud, setActiveCloud] = useState(false);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [photo, setPhoto] = useState();

  const logout = () => {
    dispatch(setAuth(false));
    localStorage.removeItem("token");
    nav("/");
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setPhoto(avatar);
      dispatch(
        getUserByIdChunck(jwt_decode(localStorage.getItem("token")).id)
      ).then((data) => {
        setPhoto("http://localhost:5000/" + data.payload.userInfo.avatar);
      });
    }
  }, [isAuth, avatar,dispatch]);

  const goToSignIn = () => {
    nav("/login");
  };

  return (
    <section className={ms.container}>
      <section className={ms.container__logoSection}>
        <Link to={"/"}>
          <img
            className={ms.container__logoSection__logo}
            src={logo}
            alt="logo.png"
          />
        </Link>
        <Link to={"/"}>
          <img
            className={ms.container__logoSection__title}
            src={title}
            alt="title.png"
          />
        </Link>
      </section>
      <Search />

      <Link to={isAuth ? "/account" : "/login"}>
        <img
          className={ms.container__avatar}
          src={!photo || String(avatar)?.includes("null") ? user : photo}
          alt="avatar.png"
          onMouseMove={() => setActiveCloud(true)}
          onMouseLeave={() => {
            setTimeout(() => setActiveCloud(false), 3000);
          }}
        />
      </Link>
      <section className={ms.container__logoutMenu}>
        {isAuth ? (
          <CloudMessage
            action={logout}
            isActive={isActiveCloud}
            fullname={
              localStorage.getItem("token")
                ? jwt_decode(localStorage.getItem("token")).firstname +
                  " " +
                  jwt_decode(localStorage.getItem("token")).lastname
                : null
            }
            name={"Logout"}
          />
        ) : (
          <CloudMessage
            action={goToSignIn}
            isActive={isActiveCloud}
            fullname={"Anonimus"}
            name={"Sign In"}
          />
        )}
      </section>
    </section>
  );
};

export default Header;

const Search = () => {
  const dispatch = useDispatch();
  let keyword = useSelector((s) => s.search.text);
  const navItems = useSelector((s) => s.navBar.items);
  const nav = useNavigate();
  const loc = useLocation();
  const [modal, setModal] = useState(false);

  const goToSearch = () => {
    const query = {
      keyword: keyword,
    };
    if (keyword !== "") dispatch(getProductsThunk(query));
  };

  return (
    <section className={ms.container__searchSection}>
      <section className={ms.container__searchSection__searchWrapper}>
        <img
          className={ms.container__searchSection__searchWrapper__search}
          src={search}
          alt="search.png"
        />
      </section>
      <section
        onMouseLeave={() => {
          setModal(false);
        }}
        className={ms.container__searchSection__inputWrapper}
      >
        <input
          onChange={(e) => {
            setModal(true);
            if (loc.pathname.split("/")[1] === "") {
              nav("/catalog");
              dispatch(
                setActive(navItems.findIndex((el) => el.to === "/catalog"))
              );
              localStorage.setItem(
                "currentLocation",
                navItems.findIndex((el) => el.to === "/catalog")
              );
            }
            dispatch(setText(e.target.value));
            goToSearch();
          }}
          value={keyword}
          className={ms.container__searchSection__inputWrapper__input}
          type="text"
          placeholder="Search"
        />
        <Modal isActive={modal} />
      </section>
    </section>
  );
};

const Modal = ({ isActive }) => {
  const testList = useSelector((s) => s.productsList.testList);
  let keyword = useSelector((s) => s.search.text);
  const dispatch = useDispatch();
  return (
    <section
      className={
        isActive
          ? ms.container__searchSection__inputWrapper__modal +
            " " +
            ms.modalActive
          : ms.container__searchSection__inputWrapper__modal
      }
    >
      <section
        className={ms.container__searchSection__inputWrapper__modal__list}
      >
        {testList.slice(0, 4).map((el) => (
          <li
            onClick={(e) => {
              dispatch(setText(e.target.innerHTML));
            }}
            key={Math.random()}
          >
            {el.title}
          </li>
        ))}
        <div
          className={ms.container__searchSection__inputWrapper__modal__border}
        ></div>
      </section>

      <section
        className={ms.container__searchSection__inputWrapper__modal__goods}
      >
        <h3>Goods</h3>
        <section
          className={
            ms.container__searchSection__inputWrapper__modal__goods__row
          }
        >
          {testList.find(
            (el) =>
              String(el.title).toLowerCase() === String(keyword).toLowerCase()
          ) ? (
            <Link
              to={`/catalog/${
                testList.find(
                  (el) =>
                    String(el.title).toLowerCase() ===
                    String(keyword).toLowerCase()
                )?.category
              }/${
                testList.find(
                  (el) =>
                    String(el.title).toLowerCase() ===
                    String(keyword).toLowerCase()
                )?.id
              }`}
            >
              <img
                src={
                  "http://localhost:5000/" +
                  String(testList[0]?.avatar)?.replace('"', "").replace('"', "")
                }
                alt={'img'}
              />
            </Link>
          ) : (
            <img src={require("../../assets/images/notFound.webp")} 
              alt={'img'}
            />
          )}

          <span>
            {testList.find(
              (el) =>
                String(el.title).toLowerCase() === String(keyword).toLowerCase()
            ) ? (
              <Link
                to={`/catalog/${
                  testList.find(
                    (el) =>
                      String(el.title).toLowerCase() ===
                      String(keyword).toLowerCase()
                  )?.category
                }/${
                  testList.find(
                    (el) =>
                      String(el.title).toLowerCase() ===
                      String(keyword).toLowerCase()
                  )?.id
                }`}
              >
                {
                  testList.find(
                    (el) =>
                      String(el.title).toLowerCase() ===
                      String(keyword).toLowerCase()
                  ).title
                }
              </Link>
            ) : (
              <section>"nothing..."</section>
            )}
          </span>
        </section>
      </section>
    </section>
  );
};
