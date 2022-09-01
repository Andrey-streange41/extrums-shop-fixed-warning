import React, { FC, useEffect, useState } from "react";
import { switchPriceMenu } from "../../../app/slices/toolsPanelSlice.ts";
import ms from "./style.module.scss";
import ddd from "../../../assets/images/birdUp.png";
import birdDown from "../../../assets/images/birdDown.png";
import birdUp from "../../../assets/images/ddd.png";
import sortBlack from "../../../assets/images/sortBlack.png";
import { setActiveItem } from "../../../app/slices/sortSlice.ts";
import {
  setFavoriteList,
  setProductsList,
} from "../../../app/slices/productsListSlice.ts";
import { useAppSelector, useAppDispatch } from "../../../hooks.ts";
import { RootState } from "../../../app/store.ts";
import { IProduct, IUserInterfaceItem } from "../../../types/favoriteList.types";

interface ISort{
  category:string;
}

export const Sort:FC<ISort> = ({ category }) => {
  const isActivePriceMenu = useAppSelector(
    (s: RootState) => s.toolsPanel.isActivePriceMenu
  );
  const sortName = useAppSelector((s: RootState) => s.sort.sortName);
  const dispatch = useAppDispatch();

  return (
    <>
      <section
        onClick={(e) => {
          e.stopPropagation();
          dispatch(switchPriceMenu());
        }}
        className={
          !isActivePriceMenu
            ? ms.container__rectangle1
            : ms.container__rectangle1_v2
        }
      >
        <img src={!isActivePriceMenu ? ddd : sortBlack} alt="sort.png" />
        <section style={{ textTransform: "capitalize" }}>{sortName}</section>
        <img src={!isActivePriceMenu ? birdUp : birdDown} alt="bird.png" />
        <ModalForSort category={category} isActive={isActivePriceMenu} />
      </section>
    </>
  );
};

interface IModalSort {
  isActive: boolean;
  category: string;
}

interface ITypeSortList {
  name: string;
  isActive: boolean;
}

const ModalForSort: FC<IModalSort> = ({ isActive, category }) => {
  const modalCommentsItems = useAppSelector(
    (s: RootState) => s.sort.sortItemsForComment
  );
  const modalProductsItems = useAppSelector(
    (s: RootState) => s.sort.sortItemsForProducts
  );
  const productsList = useAppSelector(
    (s: RootState) => s.productsList.testList
  );
  const favoriteList = useAppSelector(
    (s: RootState) => s.productsList.favoriteList
  );

  const [targetModalList, setTargetList] = useState<ITypeSortList[]>([]);

  let sortProductList = [...productsList];
  let sortFavoriteList = [...favoriteList];
  let commentsSortedProductsList:IProduct[] = [];

  useEffect(() => {
    setTargetList(
      category === "products" ? modalProductsItems : modalCommentsItems
    );
  }, [category,modalCommentsItems,modalProductsItems]);
  const dispatch = useAppDispatch();

  const sorting = (el:ITypeSortList) => {
    dispatch(setActiveItem({ name: el.name }));
    if (el.name === "price") {
      sortProductList.sort((a, b) => a.price - b.price);
      sortFavoriteList.sort((a, b) => a.price - b.price);
    } else if (el.name === "likes") {
      sortProductList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "likes").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "likes").amount
      );
      sortFavoriteList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "likes").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "likes").amount
      );
    } else if (el.name === "dislikes") {
      sortProductList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "dislikes").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "dislikes").amount
      );
      sortFavoriteList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "dislikes").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "dislikes").amount
      );
    } else if (el.name === "views") {
      sortProductList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "views").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "views").amount
      );
      sortFavoriteList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "views").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "views").amount
      );
    } else if (el.name === "favorites") {
      sortProductList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "favorites").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "favorites").amount
      );
      sortFavoriteList.sort(
        (a, b) =>
          a.userComunications.find((el:IUserInterfaceItem) => el.name === "favorites").amount -
          b.userComunications.find((el:IUserInterfaceItem) => el.name === "favorites").amount
      );
    } else if (el.name === "name") {
      for (let i = 0; i < sortProductList.length; i++) {
        let element = sortProductList[i];
        let commentsTmp = [...element.comments];
        commentsTmp.sort((a, b) => (a.owner > b.owner ? 1 : -1));
        element = { ...element, comments: commentsTmp };
        commentsSortedProductsList = [...commentsSortedProductsList, element];
      }
      sortProductList = [...commentsSortedProductsList];
    } else if (el.name === "date") {
      for (let i = 0; i < sortProductList.length; i++) {
        let element = sortProductList[i];
        let commentsTmp = [...element.comments];
        commentsTmp.sort((a, b) => (a.date.day > b.date.day ? 1 : -1));
        element = { ...element, comments: commentsTmp };
        commentsSortedProductsList = [...commentsSortedProductsList, element];
      }
      sortProductList = [...commentsSortedProductsList];
    } else if (el.name === "time") {
      for (let i = 0; i < sortProductList.length; i++) {
        let element = sortProductList[i];
        let commentsTmp = [...element.comments];
        commentsTmp.sort((a, b) => (a.date.hour > b.date.day ? 1 : -1));
        element = { ...element, comments: commentsTmp };
        commentsSortedProductsList = [...commentsSortedProductsList, element];
      }
      sortProductList = [...commentsSortedProductsList];
    }
    dispatch(setProductsList(sortProductList));
    dispatch(setFavoriteList(sortFavoriteList));
  };

  return (
    <ul
      className={
        isActive ? ms.modalContainer + " " + ms.active : ms.modalContainer
      }
    >
      {targetModalList.map((el:ITypeSortList) => (
        <li
          key={Math.random()}
          onClick={() => sorting(el)}
          className={
            el.isActive
              ? ms.modalContainer__item + " " + ms.modalItemActive
              : ms.modalContainer__item
          }
        >
          <span style={{ textTransform: "capitalize" }}>{el.name}</span>
        </li>
      ))}
    </ul>
  );
};
