import React from "react";
import { useNavigate } from "react-router-dom";
import { selectSubItem } from "../../../app/slices/navBarSlice.ts";
import { Modal } from "./Modal/index.tsx";
import ms from "./style.module.scss";
import { getProductsThunk } from "../../../app/slices/productsListSlice.ts";
import {useAppSelector,useAppDispatch} from '../../../hooks.ts';

export const SubMenu = () => {
  const subMenu = useAppSelector((s) => s.navBar.subMenu);
  const list = useAppSelector((s) => s.navBar.items);
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const catalog = 'catalog/';
  const favorites = 'favorites/';

  return (
    <section
      className={ms.container}
      style={
        list.find((el) => el.text === "categories").isActive ||
        list.find((el) => el.text === "favorites").isActive
          ? {
              display: "flex",
            }
          : {
              display: "none",
            }
      }
    >
      {subMenu.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (list.find((el) => el.text === "categories").isActive) {
              nav("/" + catalog + item.text);
            } else if (list.find((el) => el.text === "favorites").isActive) {
              nav("/" + favorites + item.text);
            }
            const query = {
              category: "",
            };
            query.category = item.text;
            dispatch(getProductsThunk(query));
            dispatch(selectSubItem(index));
          }}
          className={
            (item.isActive ? ms.activeBlock + " " : "") + ms.container__item
          }
        >
          <img src={item.img} alt="submenuItem.png" />
          <span>{item.text}</span>
          <Modal
            test={item}
            item={item.modalItems}
            active={item.isActive ? true : false}
          />
        </div>
      ))}
    </section>
  );
};
