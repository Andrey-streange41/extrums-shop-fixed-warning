import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Footer } from "../../components/Footer";
import { NavBar } from "../../components/NavBar";
import ms from "./style.module.scss";
import cellphones from "../../assets/images/banner2.png";
import laptops from "../../assets/images/laptops.png";
import banner from "../../assets/images/banner.png";
import library from "../../assets/images/library.png";
import sport from "../../assets/images/sport.png";
import travel from "../../assets/images/travel.png";
import { useDispatch } from "react-redux";
import { getProductsThunk } from "../../app/slices/productsListSlice.ts";





export const Home = () => {
  const dispatch = useDispatch();
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Header />
      <section className={ms.container}>
        <section>
          <NavBar />
        </section>
        <section className={ms.container__wrapper}>
          <section className={ms.container__wrapper__content}>
            <img
              src={banner}
              className={ms.container__wrapper__content__advertising}
              alt={'adversing'}
            />

            <section className={ms.container__wrapper__content__row}>
              <Link to={"/catalog/Electronics/subcategory/Smartphones"} onClick={() =>
                  {
                    dispatch(
                    getProductsThunk({
                      category: "Electronics",
                      sub_category: "Smartphones",
                    })
                  )
                }
                }>
                <img
                  className={ms.container__wrapper__content__row__col1}
                  src={cellphones}
                  alt="smartphones"
                />
              </Link>
              <Link
                to={"/catalog/Electronics/subcategory/Laptops"}
                onClick={() =>
                  dispatch(
                    getProductsThunk({
                      category: "Electronics",
                      sub_category: "Laptops",
                    })
                  )
                }
              >
                <img src={laptops} alt="laptops" />
              </Link>
            </section>
            <section className={ms.container__wrapper__content__row}>
              <Link
                to={"/catalog/Books"}
                onClick={() =>
                  dispatch(getProductsThunk({ category: "books" }))
                }
              >
                <img src={library} alt="library.png" />
              </Link>
              <Link
                to={"/catalog/Sports"}
                onClick={() =>
                  dispatch(getProductsThunk({ category: "sport" }))
                }
              >
                <img src={sport} alt="sport.png" />
              </Link>
              <Link
                to={"/catalog/Travel"}
                onClick={() =>
                  dispatch(getProductsThunk({ category: "travel" }))
                }
              >
                <img src={travel} alt="travel" />
              </Link>
            </section>
          </section>
        </section>
      </section>
      <section>
        <Footer />
      </section>
    </section>
  );
};
