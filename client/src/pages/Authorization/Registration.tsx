import React from "react";
import { AuthHeader } from "../../components/Header/AuthHeader/index.tsx";
import ms from "./style.module.scss";
import {RegistrationMenu} from '../../components/RegistrationMenu/index.tsx';

export const Registration = () => {
  return (
    <div className={ms.container}>
      <AuthHeader />
      <RegistrationMenu/>
    </div>
  );
};
