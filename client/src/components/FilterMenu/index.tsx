import React, {  useEffect, useMemo, useState } from "react";
import ms from "./style.module.scss";
import birdDown from "../../assets/images/birdDown.png";
import birdUp from "../../assets/images/birdUpModal.png";
import { selectModalItem } from "../../app/slices/navBarSlice.ts";
import { CheckBox } from "./CheckBox/index.tsx";
import closeModal from "../../assets/images/closeModal.png";
import { switchFilterMenu } from "../../app/slices/toolsPanelSlice.ts";
import {
  switchCategoryMenu,
  switchPriceMenu,
  switchAddMenu2,
  setPrice,
} from "../../app/slices/modalFilterSlice.ts";
import { getProductsThunk } from "../../app/slices/productsListSlice.ts";
import { useAppSelector,useAppDispatch } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

export const FilterMenu = () => {
  const subMenu = useAppSelector((s: RootState) => s.navBar.subMenu);
  const isOpenCategoryMenu = useAppSelector(
    (s: RootState) => s.modalFilter.isOpenCategoryMenu
  );
  const dispatch = useAppDispatch();
  const isActiveFilterMenu = useAppSelector(
    (s: RootState) => s.toolsPanel.isActiveFilterMenu
  );
  const isOpenPriceMenu = useAppSelector(
    (s: RootState) => s.modalFilter.isOpenPriceMenu
  );
  const isOpenAddMenu_2 = useAppSelector(
    (s: RootState) => s.modalFilter.isOpenAddMenu_2
  );
  const price = useAppSelector((s: RootState) => s.modalFilter.price);

  const [purposeList, setPurposeList] = useState<string[]>([]);

  const handleSelectPurpose = (purposeItem: any) => {
    if (purposeItem.isActive) {
      setPurposeList([...purposeList, purposeItem.text]);
    } else {
      setPurposeList(purposeList.filter((el) => el !== purposeItem.text));
    }
  };

  
  const getFilter = async () => {
    const query = {
      purposes: purposeList,
      category: subMenu[subMenu.findIndex((el) => el.isActive)]?.text,
      sub_category: subMenu
        .find((el) => el.isActive)
        ?.modalItems?.items?.find((el) => el.isActive)?.category,
      price: price,
    };
    dispatch(getProductsThunk(query));
  };
const memoizedCallback = useMemo(getFilter,[price, dispatch,purposeList,subMenu]);

  useEffect(() => {
    
  }, [memoizedCallback]);
  return (
    <section
      className={
        isActiveFilterMenu
          ? ms.container + " " + ms.active
          : ms.container + " " + ms.unactive
      }
    >
      <section className={ms.container__categories}>
        <img
          src={!isOpenCategoryMenu ? birdUp : birdDown}
          alt="bird.png"
          onClick={() => {
            dispatch(switchCategoryMenu());
          }}
        />
        <h2>Subcategories</h2>
      </section>
      <img
        onClick={() => dispatch(switchFilterMenu())}
        className={ms.container__closeModal}
        src={closeModal}
        width={30}
        height={30}
        alt={"img"}
      />
      <ul
        className={
          !isOpenCategoryMenu
            ? ms.container__list + " " + ms.unactive
            : ms.container__list
        }
      >
        {subMenu.find((i) => i.isActive) ? (
          subMenu
            .find((i) => i.isActive)
            ?.modalItems.items.map((item, index) => (
              <section className={ms.container__list__item} key={index}>
                <li>
                  <div
                    className={item.isActive ? ms.radioActive : null}
                    onClick={() => {
                      const query = {
                        category:
                          subMenu[subMenu.findIndex((el) => el.isActive)]?.text,
                        sub_category: item?.category,
                      };
                      dispatch(getProductsThunk(query));
                      dispatch(selectModalItem(index));
                    }}
                  ></div>
                </li>
                <label htmlFor={item.category}>{item.category}</label>
              </section>
            ))
        ) : (
          <h1>Select category !</h1>
        )}
      </ul>
      <div className={ms.border}></div>
      <section className={ms.container__categories}>
        <img
          src={!isOpenPriceMenu ? birdUp : birdDown}
          alt="bird.png"
          onClick={() => dispatch(switchPriceMenu())}
        />
        <h2>Price</h2>
      </section>
      <section
        className={
          isOpenPriceMenu
            ? ms.container__price
            : ms.container__price + " " + ms.unactive
        }
      >
        <input
          name={"min"}
          value={price.min}
          type="text"
          placeholder="10$"
          maxLength={6}
          onChange={(e) => {
            dispatch(setPrice({ ...price, [e.target.name]: e.target.value }));
          }}
        />
        <div className={ms.line}></div>
        <input
          name="max"
          type="text"
          placeholder="156000$"
          maxLength={6}
          value={price.max}
          onChange={(e) => {
            dispatch(setPrice({ ...price, [e.target.name]: e.target.value }));
          }}
        />
      </section>

      <div className={ms.border}></div>
      <section className={ms.container__categories}>
        <img
          src={isOpenAddMenu_2 ? birdDown : birdUp}
          alt="bird.png"
          onClick={() => dispatch(switchAddMenu2())}
        />
        <h2>Purpose</h2>
      </section>
      <section
        className={
          isOpenAddMenu_2
            ? ms.container__checkboxMenu2
            : ms.container__checkboxMenu2 + " " + ms.unactive
        }
      >
        {subMenu.find((el) => el.isActive) ? (
          subMenu
            .find((el) => el.isActive)
            ?.purpose.map((item) => (
              <CheckBox
                handleSelect={handleSelectPurpose}
                key={item.name}
                item={{ ...item, text: subMenu.text }}
              />
            ))
        ) : (
          <h1>Select category !</h1>
        )}
      </section>
    </section>
  );
};
