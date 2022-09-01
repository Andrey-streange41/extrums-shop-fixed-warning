import React from "react";
import Header from "../../components/Header/Header";
import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";
import { LocationMenu } from "../../components/LocationMenu/index.tsx";
import ms from "./style.module.scss";
import { ToolsPanel } from "../../components/ToolsPanel/index.tsx";
import { FilteredList } from "../../components/FilteredList/index.tsx";
import { FilterMenu } from "../../components/FilterMenu/index.tsx";
import {useAppSelector} from '../../hooks.ts';




export const Catalog = () => {
  const testList = useAppSelector((s) => s.productsList.testList);
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
            {!testList.length ? (
              "No such category !"
            ) : (
              <FilteredList filterList={testList} />
            )}
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};
