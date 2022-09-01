import React, { FC, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { Link, useNavigate } from "react-router-dom";
import ms from "./style.module.scss";
import { NavBar } from "../../components/NavBar/index.jsx";
import Header from "../../components/Header/Header.jsx";
import { Footer } from "../../components/Footer/index.jsx";
import { OutlineButton } from "../../components/UI/Button/index.tsx";
import { StatistickCard } from "../../components/StatistickCard/index.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector } from "../../hooks.ts";
import {
  faHeart,
  faEye,
  faCrown,
  faThumbsDown,
  faUsers,
  faShop,
  faScaleBalanced,
} from "@fortawesome/free-solid-svg-icons";
import { IUserInterfaceItem } from "../../types/favoriteList.types";
import { RootState } from "../../app/store.ts";
import jwt_decode from 'jwt-decode';

export const Admin: FC = () => {
  const users = useAppSelector((s:RootState) => s.user.users);
  const productsS = useAppSelector((s:RootState) => s.productsList.testList);
  const [likesS, setlikes] = useState<number>(0);
  const [viewsS, setViews] = useState<number>(0);
  const [favoritesS, setFavorites] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [salesPerDay, setSalesperDay] = useState<number>(
    Math.floor(Math.random() * (100000 - 0) + 0)
  );
  const [salesPerDayIntervalId, setSalesId] = useState<number | undefined>(
    undefined
  );
  const isAuth = useAppSelector(s=>s.user.isAuth);
  const [tiket,setTiket] = useState();

  interface IVisitsPerDay{
    amount:number;
    timerId:number|undefined;
  }
  const [visitsPerDay, setVisitPerDay] = useState<IVisitsPerDay>({
    amount: Math.floor(Math.random() * (10000 - 0) + 0),
    timerId: undefined,
  });

  useEffect(() => {
    let acumulator = 0;
    if(localStorage.getItem('token')){
      setTiket(jwt_decode<any>(String(localStorage.getItem('token'))).role);
    }
    for (let i = 0; i < productsS.length; i++) {
      const element = productsS[i].userComunications.find(
        (el:IUserInterfaceItem) => el.name === "views"
      ).amount;
      acumulator += element;
    }
    setViews(acumulator);
    let likesTotalAmount = 0;
    for (let i = 0; i < productsS.length; i++) {
      const element = productsS[i].userComunications.find(
        (el:IUserInterfaceItem) => el.name === "likes"
      ).amount;
      likesTotalAmount += element;
    }
    setlikes(likesTotalAmount);

    setFavorites(acumulator);
    let favorTotalAmount = 0;
    for (let i = 0; i < productsS.length; i++) {
      const element = productsS[i].userComunications.find(
        (el:IUserInterfaceItem) => el.name === "favorites"
      ).amount;
      favorTotalAmount += element;
    }
    setFavorites(favorTotalAmount);

    let disTotalAmount = 0;
    for (let i = 0; i < productsS.length; i++) {
      const element = productsS[i].userComunications.find(
        (el:IUserInterfaceItem) => el.name === "dislikes"
      ).amount;
      disTotalAmount += element;
    }
    setDislikes(disTotalAmount);

    setSalesId(
      setInterval(() => {
        setSalesperDay(Math.floor(Math.random() * (100000 - 0) + 0));
      }, 10000)
    ); //24hour 86400000
    setVisitPerDay({
      ...visitsPerDay,
      timerId: setInterval(() => {
        setVisitPerDay({
          ...visitsPerDay,
          amount: Math.floor(Math.random() * (10000 - 0) + 0),
        });
      }, 10000),
    });

    return () => {
      clearInterval(salesPerDayIntervalId);
      setSalesId(undefined);
      clearInterval(visitsPerDay.timerId);
      setVisitPerDay({ ...visitsPerDay, timerId: undefined });
    };
  }, [isAuth,productsS]);

  const statistick = [
    {
      img: <FontAwesomeIcon icon={faThumbsDown} />,
      title: "Dislikes",
      amount: dislikes,
      info: "All time",
    },
    {
      img: <FontAwesomeIcon className={ms.heart} icon={faHeart} />,
      title: "Likes",
      amount: likesS,
      info: "All time",
    },
    {
      img: <FontAwesomeIcon className={ms.crown} icon={faCrown} />,
      title: "In favorites",
      amount: favoritesS,
      info: "All time",
    },
  ];
  const cards = [
    {
      title: "Sales",
      amount: salesPerDay,
      info: "Total Sales Today",
      proc: Math.floor((salesPerDay / 100000) * 100),
      color: "rgb(224, 255, 198)",
    },
    {
      title: "Profit",
      amount: "$150",
      info: "Per day ratio",
      proc: 30,
      color: "#e7d3ff",
    },
    {
      title: "Orders",
      amount: "1000",
      info: "Total orders",
      proc: 80,
      color: "#d3f1ff",
    },
    {
      title: "Visits",
      amount: visitsPerDay.amount,
      info: "Total Visits today",
      proc:  Math.floor((visitsPerDay.amount / 10000) * 100),
      color: "rgb(245, 199, 207)",
    },
  ];
  const revenueList = [
    {
      img: <FontAwesomeIcon className={ms.scale} icon={faScaleBalanced} />,
      amount: 100000 + "$",
      title: "Sales record",
    },
    {
      img: <FontAwesomeIcon className={ms.users} icon={faUsers} />,
      amount: users.length,
      title: "Registered users",
    },
    {
      img: <FontAwesomeIcon className={ms.products} icon={faShop} />,
      amount: productsS.length,
      title: "Products",
    },
    {
      img: <FontAwesomeIcon className={ms.views} icon={faEye} />,
      amount: viewsS,
      title: "views",
    },
  ];
  const [data] = useState([
    ["Element", "Density", { role: "style" }],
    ["Electronic", 8.94, "#b87333"],
    ["Cars", 10.49, "silver"],
    ["Clouthing", 19.3, "gold"],
  ]);
  const user = useAppSelector((s:RootState) => s.user.userData);
  const role = useAppSelector((s:RootState) => s.user.userData.role);
  const nav = useNavigate();

  useEffect(() => {
    if (role === "USER") {
      nav("/");
    }
  }, [nav,role]);

  return tiket=== "ADMIN" ? (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <section className={ms.container__field__content}>
            <section className={ms.container__field__content__col1}>
              <section className={ms.container__field__content__col1__row1}>
                <section
                  className={ms.container__field__content__col1__row1__greeting}
                >
                  <h1>Hello {user.firstname}</h1>
                  <span>Welcome Back !</span>
                </section>
                <section  className={ms.container__field__content__col1__row1__greeting__buttons}>
                  <Link
                  style={{ textDecoration: "none" }}
                  to={"/admin/addProduct"}
                >
                  <OutlineButton text={"Add Product"} width={150} />
                </Link>
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/admin/showUsers"}
                >
                  <OutlineButton text={"Show Users"} width={150} />
                </Link>
                </section>
                
              </section>
              <ul className={ms.container__field__content__col1__statistick}>
                {statistick.map((el) => (
                  <li
                    key={el.title}
                    className={
                      ms.container__field__content__col1__statistick__item +
                      " " +
                      ms.col
                    }
                  >
                    <div
                      className={
                        ms.container__field__content__col1__statistick__item__icon
                      }
                    >
                      {el.img}
                    </div>
                    <span
                      className={
                        ms.container__field__content__col1__statistick__item__title
                      }
                    >
                      {el.title}
                    </span>
                    <span
                      className={
                        ms.container__field__content__col1__statistick__item__amount
                      }
                    >
                      {el.amount}
                    </span>
                    <span
                      className={
                        ms.container__field__content__col1__statistick__item__info
                      }
                    >
                      {el.info}
                    </span>
                  </li>
                ))}
              </ul>
              <ul className={ms.container__field__content__col1__list}>
                {cards.map((el) => (
                  <StatistickCard key={el.title} item={el} />
                ))}
              </ul>
            </section>
            <section className={ms.container__field__content__col2}>
              <h2>Sales Revenue</h2>
              <ul className={ms.container__field__content__col2__list}>
                {revenueList.map((el) => (
                  <li
                    key={Math.random()}
                    className={ms.container__field__content__col2__list__item}
                  >
                    <section
                      className={
                        ms.container__field__content__col2__list__item__round
                      }
                    >
                      {el.img}
                    </section>
                    <section
                      className={
                        ms.container__field__content__col2__list__item__info
                      }
                    >
                      <span>{el.amount}</span>
                      <span>{el.title}</span>
                    </section>
                  </li>
                ))}
              </ul>
              <h2>Statisticks</h2>
              <Chart chartType="ColumnChart" height="400px" data={data} />
            </section>
            
          </section>
          
        </section>
      </section>
      <Footer />
    </>
  ) : (
    <>
      <h1> Forbiden ! 403</h1>
      <img
        width={"100%"}
        src={require("../../assets/images/forbiden.jpg")}
        alt=""
      />
    </>
  );
};
