import React, { useEffect, useState } from "react";
import ms from "./style.module.scss";
import { SubMenu } from "./SubMenu/index.tsx";
import { Link,  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setActive } from "../../app/slices/navBarSlice.ts";
import {
  offAllSubCategory,
} from "../../app/slices/navBarSlice.ts";
import { getProductsThunk } from "../../app/slices/productsListSlice.ts";
import jwt_decode from "jwt-decode";

export const NavBar = () => {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.navBar.items);
  const isAuth = useSelector((s) => s.user.isAuth);
  const role = useSelector((s) => s.user.userData.role);
  const [tiket, setTiket] = useState();
  const token =localStorage.getItem("token");

  useEffect(() => {
    if (localStorage.getItem("token")) { 
      setTiket(jwt_decode(localStorage.getItem("token"))?.role);
    }
    if (
      localStorage.getItem("currentLocation") &&
      items.findIndex((el) => el.isActive) === -1
    )
      dispatch(setActive(localStorage.getItem("currentLocation")));
  }, [isAuth, role,items,dispatch,token]);

  return (
    <section className={ms.container}>
      <ul className={ms.container__linkList}>
        {items.map((item, index) => {
          if (
            index === 1 &&
            (tiket !== "ADMIN" || !localStorage.getItem("token"))
          ) {
            return null;
          }
          return <MenuItem key={index} item={item} index={index} />;
        })}
      </ul>
      <section className={ms.container__subMenu}>
        <SubMenu />
      </section>
    </section>
  );
};

const MenuItem = ({ item, index }) => {
  const subMenu = useSelector((s) => s.navBar.subMenu);
  const dispatch = useDispatch();
  const nav = useNavigate();

  return (
    <Link style={{ textDecoration: "none" }} to={`${item.to}`}>
      <div
        className={ms.container__linkList__myLink}
        key={item.to}
        onClick={() => {
          if (item.text === "categories" || item.text === "favorites") {
            dispatch(getProductsThunk());
          }
          dispatch(offAllSubCategory());
          if (!item.isActive) {
            nav(item.to);
            if (!subMenu.find((i) => i.isActive)) {
            }
            dispatch(setActive(index));
            localStorage.removeItem("currentLocation");
            localStorage.setItem("currentLocation", index);
          }
        }}
      >
        <li className={item.isActive ? ms.activeBlock : null}>
          <img
            className={item.isActive ? ms.active : null}
            src={item.isActive ? item.active : item.img}
            alt={"link"}
          />
          <span>{item.text}</span>
        </li>
      </div>
    </Link>
  );
};
