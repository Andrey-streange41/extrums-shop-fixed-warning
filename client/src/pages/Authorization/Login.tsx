import React from 'react';
import {LoginMenu} from '../../components/LoginMenu/index.tsx';
import { AuthHeader } from "../../components/Header/AuthHeader/index.tsx";
import ms from "./style.module.scss";

export const Login = () => {
  return (
    <div className={ms.container}>
       <AuthHeader />
       <LoginMenu/>
    </div>
  )
}
