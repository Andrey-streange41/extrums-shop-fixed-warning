import React, { FC, useEffect, useState } from "react";
import ms from "./style.module.scss";
import { Button } from '../../../components/UI/Button/index.tsx';
import { IProduct } from "../../../favoriteList.types";
import {months} from '../CommentsList/index.tsx';
import {useAppSelector} from '../../../hooks.ts';

interface IAddCommentsProps {
  item: IProduct,
  handleClick:()=>{},
  handleChange:()=>{},
  date:{
    month,hour,min,day,year
  },
  message:string;
}

export const AddComment: FC<IAddCommentsProps> = ({ date, handleClick, handleChange,message}) => {
 const user = useAppSelector((s) => s.user.userData);
const isAuth = useAppSelector((s)=>s.user.isAuth);

  return (
    isAuth?
    <div className={ms.container}>
      <section className={ms.container__userInfo}>
        <img src={user.avatar || 'Anonimus'} alt="avatar.png" />
        <span>{user.firstname}</span>
        <span>{months[date.month] + " " + date.day + ", " + date.year}</span>
        <span>{date.hour + " : " + date.min + " PM"}</span>
      </section>
      <section className={ms.container__comment}>
        <textarea value={message} onChange={handleChange} maxLength={200} name="story" placeholder="Comment text...">
        </textarea>
      </section>
      <Button text={'Add comment'} handleSubmit={handleClick} />
    </div>
    :
    <h1>Only registered users can leave comments!  </h1>
  );
};
