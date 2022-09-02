import React from "react";

import { IProduct } from "../../types/favoriteList.types.ts";
import { ProductCard } from "../ProductCard/index.tsx";
import { ProductCardV2 } from "../ProductCardV2/index.tsx";
import ms from "./style.module.scss";
import { useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

export const FilteredList = ({ filterList }) => {
  const mode = useAppSelector((s: RootState) => s.toolsPanel.isActiveViewMode);

  return (
    <>
      {mode ? (
        <section className={ms.container}>
          {filterList?.map((item: IProduct) => (
            <ProductCardV2 key={Math.random()} item={item} />
          ))}
        </section>
      ) : (
        filterList?.map((item: IProduct) => (
          <ProductCard key={Math.random()} item={item} />
        ))
      )}
    </>
  );
};
