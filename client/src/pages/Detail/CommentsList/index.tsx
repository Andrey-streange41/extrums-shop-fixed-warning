import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Sort } from "../../../components/ToolsPanel/Sort/index.tsx";
import { Comment } from "../Comment/index.tsx";
import ms from "./style.module.scss";
import { IProduct } from "../../../types/favoriteList.types.ts";
import { AddComment } from "../AddComment/index.tsx";
import { addCommentToProductThunk } from "../../../app/slices/productsListSlice.ts";

interface ICommentsListProps {
  item: IProduct;
}

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const d = new Date();
let month = d.getMonth();
let day = d.getDate();
let year = d.getFullYear();
let hour = d.getHours();
let min = d.getMinutes();

export const CommentsList: FC<ICommentsListProps> = ({ item }) => {
  const loading = useSelector((s) => s.productsList.loading);
  let product = useSelector((s) =>
    s.productsList.testList.find((el) => el.id === item.id)
  );
  const [textMessage, setTextMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.userData);
  const isAuth = useSelector((s) => s.user.isAuth);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const date = {
      day: day,
      hour: hour,
      minute: min,
      month: month,
      year: year,
      second: null,
    };
    if (!isAuth) {
      alert("Comments can be posted only by registered users !");
      return;
    }
    dispatch(
      addCommentToProductThunk({
        userId: user.id,
        comment: { textMessage: textMessage, date: date },
        productId: item.id,
      })
    );
    setTextMessage("");
  };

  return (
    <section className={ms.container}>
      <section className={ms.container__sort}>
        <Sort item={item} />
      </section>
      {loading === "failed" ? (
        <h1>Error load comments !</h1>
      ) : (
        product?.comments?.map((el) => (
          <Comment key={Math.random()} id={item.id} comment={el} />
        ))
      )}
      <AddComment
        handleChange={(e) => setTextMessage(e.target.value)}
        handleClick={handleClick}
        item={item}
        message={textMessage}
        date={{ month, day, year, hour, min }}
      />
    </section>
  );
};
