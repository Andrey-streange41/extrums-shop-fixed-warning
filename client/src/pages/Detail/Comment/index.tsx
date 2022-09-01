import React, { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeCommentThunk } from "../../../app/slices/productsListSlice.ts";
import ms from "./style.module.scss";
import close from "../../../assets/images/closeModal.png";
import Loader from "../../../components/Loader/index.tsx";
import { IComment } from "../../../types/favoriteList.types.ts";

const month = [
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

interface ICommentProps {
  comment: IComment;
  id: number;
}

export const Comment: FC<ICommentProps> = ({ comment }) => {
  const dispatch = useDispatch();
  const loading = useSelector((s) => s.productsList.loading);
  const comments = useSelector((s) => s.user.comments);
  const role = useSelector((s)=>s.user.userData.role);

  const removeComment = () => {
    dispatch(removeCommentThunk(comment.id));
  };


  return loading === "pending" ? (
    <Loader />
  ) : (
    <section className={ms.container}>
      <section className={ms.container__userInfo}>
        <img
          src={"http://localhost:5000/" + comment?.user?.user_info?.avatar}
          alt="avatar.png"
        />
        <span>{comment?.user?.user_info.firstname}</span>
        <span>
          {month[comment?.date?.month] +
            " " +
            comment?.date?.day +
            ", " +
            comment?.date?.year}
        </span>
        <span>{comment?.date?.hour + " : " + comment?.date?.min + " PM"}</span>
      </section>
      <section className={ms.container__message}>{comment?.message}</section>
      {comments.find((el) => el.userId === comment.userId)  || role==='ADMIN'? (
        <img
          onClick={removeComment}
          className={ms.remove}
          src={close}
          alt="remove.png"
        />
      ) : null}
    </section>
  );
};
