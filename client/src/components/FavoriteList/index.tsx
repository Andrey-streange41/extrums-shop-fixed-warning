import React from "react";
import { ProductCard } from "../ProductCard/index.tsx";
import { ProductCard_v2 } from "../ProductCardV2/index.tsx";
import ms from "./style.module.scss";
import Loader from "../Loader/index.tsx";
import { IProduct } from "../../types/favoriteList.types.ts";
import { useAppSelector } from "../../hooks.ts";

export const FavoriteList = () => {
  const favList = useAppSelector((s) => s.productsList.favoriteList);
  const mode = useAppSelector((s) => s.toolsPanel.isActiveViewMode);
  const loading = useAppSelector((s) => s.productsList.loading);

  return favList.length <= 0 ? (
    <>
      {loading === "pending" ? (
        <Loader />
      ) : (
        <>
          {mode ? (
            <section className={ms.container}>
              {favList.map((item: IProduct) => (
                <ProductCard_v2 key={item.title} item={item} />
              ))}
            </section>
          ) : (
            favList.map((i: IProduct) => <ProductCard key={i.title} item={i} />)
          )}
        </>
      )}
    </>
  ) : (
    <h1>Favorite list is empty</h1>
  );
};
