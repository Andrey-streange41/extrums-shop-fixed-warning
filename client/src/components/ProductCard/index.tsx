import React, { useEffect, useState, FC } from "react";
import ms from "./style.module.scss";
import birka from "../../assets/images/birka.png";
import { Link, useLocation } from "react-router-dom";
import { removeFromFavoriteListThunk } from "../../app/slices/productsListSlice.ts";
import { IProduct, IUserInterfaceItem } from "../../types/favoriteList.types";
import { userCommunication } from "../../assets/images/index.js";
import { updateProductsThunk } from "../../app/slices/productsListSlice.ts";
import { addToFavoritesThunk } from "../../app/slices/productsListSlice.ts";
import { useAppSelector, useAppDispatch } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

interface ICardProps {
  item: IProduct;
}

export const ProductCard: FC<ICardProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const loc = useLocation();
  const currentPage = loc.pathname.substring(
    1,
    loc.pathname.indexOf("/", 1) > 0
      ? loc.pathname.indexOf("/", 1)
      : loc.pathname.length
  );
  const link = currentPage + "/" + item.category + "/" + item.id;
  const isAuth = useAppSelector((s: RootState) => s.user.isAuth);
  const [coms, setComs] = useState<IUserInterfaceItem[]>([]);
  const user = useAppSelector((s: RootState) => s.user.userData);
  const loading = useAppSelector((s: RootState) => s.productsList.loading);

  const handleFavoriteClick = () => {
    if (!isAuth) {
      alert("You must sign in to you account for this option !");
      return;
    }
    dispatch(
      updateProductsThunk({
        name: "favorites",
        id: item.id,
      })
    )
      .then((data: any) => {
        if (
          data.payload.userComunications.find(
            (el: IUserInterfaceItem) => el.name === "favorites"
          ).isActive
        ) {
          dispatch(
            addToFavoritesThunk({ productId: item.id, userId: user.id })
          );
        } else {
          dispatch(
            removeFromFavoriteListThunk({ productId: item.id, userId: user.id })
          );
        }
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (item && loading === "idle") {
      

      setComs(
        [...item?.userComunications]?.sort(
          (a: IUserInterfaceItem, b: IUserInterfaceItem): number =>
            String(a.name).localeCompare(b.name)
        )
      );
    }
  }, [item, user.id, loading]);

  return (
    <section className={ms.wrapper}>
      <section className={ms.container}>
        <section className={ms.container__favorite}>
          <img
            onClick={handleFavoriteClick}
            src={
              item?.userComunications?.find((el) => el.name === "favorites")
                ?.isActive && isAuth
                ? userCommunication[2]
                : userCommunication[6]
            }
            alt="star.png"
          />
        </section>
        <section className={ms.container__productInfo}>
          <Link
            className={ms.container__productInfo__imgWrapper}
            to={"/" + link}
            style={{ textDecoration: "none", color: "black", width: "33%" }}
          >
            <img
              onClick={() => {
                dispatch(updateProductsThunk({ name: "views", id: item.id }));
              }}
              className={
                ms.container__productInfo__imgWrapper__picture +
                " " +
                ms.marginLeft2em
              }
              src={
                "http://localhost:5000/" +
                String(item?.avatar).replace('"', "").replace('"', "")
              }
              alt="headphones.png"
            />
          </Link>
          <section className={ms.container__productInfo__descr}>
            <Link
              to={"/" + link}
              style={{ textDecoration: "none", color: "black" }}
              onClick={() =>
                dispatch(updateProductsThunk({ name: "views", id: item.id }))
              }
            >
              <h2>{item.title}</h2>
            </Link>
            {item.characteristics?.map((el, index) => {
              if (index >= 2) {
                return null;
              }
              return (
                <section
                  key={Math.random()}
                  className={ms.container__productInfo__descr__section}
                >
                  <span>{el.name}:</span>
                  <span>{String(el.info)}.</span>
                </section>
              );
            })}
            <section className={ms.container__productInfo__descr__price}>
              <img src={birka} alt="birka.png" />
              <span
                className={item?.discountPrice > 0 ? ms.discountPrice : null}
              >
                ${item?.discountPrice > 0 ? item?.discountPrice : item.price}
              </span>
              <span
                className={
                  (item?.discountPrice > 0 ? ms.dFlex : ms.dNone) +
                  " " +
                  ms.oldPrice
                }
              >
                ${item.price}
              </span>
            </section>
          </section>

          <section className={ms.container__productInfo__userCommunication}>
            {coms?.map((el) => (
              <section
                className={ms.container__productInfo__userCommunication__item}
                key={Math.random()}
              >
                <img
                  onClick={
                    el.name === "likes"
                      ? () => {
                          if (!isAuth) {
                            alert(
                              "You must sign in to you account for this option !"
                            );
                            return;
                          }
                          dispatch(
                            updateProductsThunk({ name: "likes", id: item.id })
                          );
                        }
                      : el.name === "dislikes"
                      ? () => {
                          if (!isAuth) {
                            alert(
                              "You must sign in to you account for this option !"
                            );
                            return;
                          }
                          dispatch(
                            updateProductsThunk({
                              name: "dislikes",
                              id: item.id,
                            })
                          );
                        }
                      : el.name === "favorites"
                      ? handleFavoriteClick
                      : () => {}
                  }
                  src={
                    el.name === "likes" && el.isActive && isAuth
                      ? userCommunication[4]
                      : el.name === "likes" && !el.isActive
                      ? userCommunication[0]
                      : el.name === "dislikes" && el.isActive && isAuth
                      ? userCommunication[1]
                      : el.name === "dislikes" && !el.isActive
                      ? userCommunication[5]
                      : el.name === "favorites" && el.isActive && isAuth
                      ? userCommunication[2]
                      : el.name === "favorites" && !el.isActive
                      ? userCommunication[6]
                      : userCommunication[3]
                  }
                  alt={"UI.png"}
                />
                <span>{el.amount}</span>
              </section>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
};
