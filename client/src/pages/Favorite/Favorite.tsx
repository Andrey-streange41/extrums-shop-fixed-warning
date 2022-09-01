import React from "react";
import Header from "../../components/Header/Header";
import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";
import ms from "./style.module.scss";
import { ToolsPanel } from "../../components/ToolsPanel/index.tsx";
import { FilteredList } from "../../components/FilteredList/index.tsx";
import { FilterMenu } from "../../components/FilterMenu/index.tsx";
import { LocationMenu } from "../../components/LocationMenu/index.tsx";
import { useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

export const Favorite = () => {
  const favorList = useAppSelector(
    (s: RootState) => s.productsList.favoriteList
  );
  const isAuth = useAppSelector((s: RootState) => s.user.isAuth);

  return (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <FilterMenu />
          <section className={ms.container__field__content}>
            <LocationMenu />
            <ToolsPanel />
            {isAuth && favorList.length > 0 ? (
              <FilteredList filterList={favorList} />
            ) : !isAuth ? (
              <h2>For favorites need authorization !</h2>
            ) : favorList.length <= 0 ? (
              <h1>Empty </h1>
            ) : (
              <span>Imposible </span>
            )}
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};
