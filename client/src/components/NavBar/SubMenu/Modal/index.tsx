import React from "react";
import ms from "./style.module.scss";
import rightArrow from "../../../../assets/images/rightArrow.png";
import { selectModalItem } from "../../../../app/slices/navBarSlice.ts";
import { useLocation, useNavigate } from "react-router-dom";
import { getProductsThunk } from "../../../../app/slices/productsListSlice.ts";
import {useAppSelector,useAppDispatch} from '../../../../hooks.ts';


export const Modal = ({  active, item }) => {
  const dispatch = useAppDispatch();
  const subMenu = useAppSelector((s) => s.navBar.subMenu);
  const loc = useLocation();
  const currentPage = loc.pathname.substring(
    1,
    loc.pathname.indexOf("/", 1) > 0
      ? loc.pathname.indexOf("/", 1)
      : loc.pathname.length
  );

  const nav = useNavigate();
  
 


  return (
    <section
      className={ms.container + " " + (active ? ms.active : ms.unactive)}
    >
      <section className={ms.container__content}>
        <section style={{ display: "flex", alignItems: "center" }}>
          <h2>{item.title}</h2>
          <img width={20} height={20} src={rightArrow} alt="arrowR" />
        </section>
        <ul>
          {item.items.map((item, index) => (
            <li
              onClick={(e) => {
                dispatch(selectModalItem(index)); 
                e.stopPropagation();
                if (item.isActive && item.category === e.target.innerHTML) {
                  nav(
                    "/" +
                      currentPage +
                      "/" +
                      subMenu[subMenu.findIndex((el) => el.isActive)]?.text
                  );
                } else {  
                   const query = {
                     category: subMenu[subMenu.findIndex((el) => el.isActive)]?.text,
                     sub_category:item?.category,
                   };
                   dispatch(getProductsThunk(query));

                  nav(
                    "/" +
                      currentPage +
                      "/" +
                      subMenu[subMenu.findIndex((el) => el.isActive)]?.text +
                      "/subcategory/" +
                      item.category
                  );
                  selectModalItem(index);
                };
              }}
              key={Math.random().toString(7)}
              className={
                item.isActive
                  ? ms.container__content__item + " " + ms.selectedItem
                  : ms.container__content__item
              }
            >
              {item.category}
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
};
