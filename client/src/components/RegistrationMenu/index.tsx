import React, { ChangeEvent, FC, useEffect, useState } from "react";
import ms from "./style.module.scss";
import signup from "../../assets/images/signup.png";
import { Input } from "../UI/Input/Input.tsx";
import { CheckBox } from "../UI/CheckBox/CheckBox.tsx";
import { Button } from "../UI/Button/index.tsx";
import { useNavigate } from "react-router-dom";
import { registration } from "../../http/userAPI.ts";
import { setAuth } from "../../app/slices/userSlice.ts";
import { setUserData } from "../../app/slices/userSlice.ts";
import { IError } from "../../pages/AccountInfo.tsx";
import * as yup from "yup";
import {useAppDispatch,useAppSelector} from '../../hooks.ts';
import {RootState} from '../../app/store.ts';

const nameRegex = /^[A-Za-z]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const reEmail = /\S+@\S+\.\S+/;
let schema = yup.object().shape({
  firstname: yup
    .string()
    .max(20)
    .matches(nameRegex, "Only English letters firstname!")
    .required(),
  lastname: yup
    .string()
    .max(20)
    .matches(nameRegex, "Only English letters lastname!")
    .required(),
  email: yup
    .string()
    .email()
    .max(40)
    .required()
    .matches(reEmail, "email have invalid format"),
  password: yup
    .string()
    .matches(
      passwordRegex,
      "password -> Minimum eight characters, at least one letter and one number, and Latin!"
    )
    .required(),
});

interface IUser{
  email:string;
  password:string;
  getUpdates:boolean;
  firstname:string;
  lastname:string;
  confirmPassword:string;
  avatar:string|null;
}

export const RegistrationMenu: FC = () => {
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const userStore = useAppSelector((s:RootState) => s.user.userData);
  const [user, setUser] = useState<IUser>({
    email: "",
    password: "",
    getUpdates: false,
    firstname: "",
    lastname: "",
    confirmPassword: "",
    avatar: null,
  });
  const [errors, setErrors] = useState<IError[]>([
    { name: "firstname", error: true, message: "" },
    { name: "lastname", error: false, message: "" },
    { name: "email", error: true, message: "" },
    { name: "password", error: false, message: "" },
  ]);
  const [isActiveAdminMode, setAdminMode] = useState<boolean>(false);
  
  useEffect(() => {
    setUser(userStore);
  }, [userStore]);

  const resetError = () => {
    const buffer: IError[] = errors.map((el) => {
      if (el.name === "password") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer);
    const buffer2: IError[] = errors.map((el) => {
      if (el.name === "email") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer2);
    const buffer3: IError[] = errors.map((el) => {
      if (el.name === "firstname" || el.name === "lastname") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer3);
    const buffer4: IError[] = errors.map((el) => {
      if (el.name === "tel") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer4);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  const handleClick = () => {
    setUser({ ...user, getUpdates: !user.getUpdates });
  };
  const signIn = async () => {
    try {
      resetError();
       await schema.validate(user);

      if (user.password !== user.confirmPassword) {
        const buffer: IError[] = errors.map((el:IError) => {
          if (el.name === "password") {
            el.message = "Password must be a similar , try agan !";
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
        return;
      } else {
        const buffer: IError[] = errors.map((el:IError) => {
          if (el.name === "password") {
            el.message = null;
            el.error = false;
          }
          return el;
        });
        setErrors(buffer);
      }

      const responce = await registration({
        email: user.email,
        password: user.password,
        firstname: user.firstname,
        lastname: user.lastname,
        role: isActiveAdminMode ? "ADMIN" : "USER",
      });

      if (responce === "error!") return;

      if (responce) {
        dispatch(setAuth(true));
        dispatch(
          setUserData({
            ...userStore,
            email: responce.email,
            firstname: responce.firstname,
            lastname: responce.lastname,
            updateAgrements: user.getUpdates,
            password: user.password,
            id: responce.id,
          })
        );
        nav("/account");
      }
    } catch (err) {
      console.log(err.message);

      resetError();
      if (String(err.message).includes("password")) {
        const buffer: IError[] = errors.map((el) => {
          if (el.name === "password") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("firstname")) {
        const buffer: IError[] = errors.map((el) => {
          if (el.name === "firstname") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("lastname")) {
        const buffer: IError[] = errors.map((el) => {
          if (el.name === "lastname") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("email")) {
        const buffer: IError[] = errors.map((el) => {
          if (el.name === "email") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (user.firstname === "" || user.lastname === "") {
        const buffer: IError[] = errors.map((el) => {
          if (el.name === "firstname" || el.name === "lastname") {
            el.message = "First name and last name is required !";
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      }
    }
  };

  return (
    <div className={ms.container}>
      <img className={ms.container__signin} src={signup} alt="" />
      <Input
        error={errors.find((el) => el.name === "firstname")}
        handleChange={handleChange}
        value={user.firstname}
        name={"firstname"}
        type={"text"}
        label={"First Name"}
      />
      <Input
        error={errors.find((el) => el.name === "lastname")}
        handleChange={handleChange}
        value={user.lastname}
        name={"lastname"}
        type={"text"}
        label={"Last Name"}
      />
      <Input
        error={errors.find((el) => el.name === "email")}
        handleChange={handleChange}
        value={user.email}
        name={"email"}
        type={"email"}
        label={"Email address"}
      />
      <Input
        error={errors.find((el) => el.name === "password")}
        handleChange={handleChange}
        value={user.password}
        name={"password"}
        type={"password"}
        label={"Password"}
      />
      <Input
        error={errors.find((el) => el.name === "password")}
        handleChange={handleChange}
        value={user.confirmPassword}
        name={"confirmPassword"}
        type={"password"}
        label={"Confirm password"}
      />
      <section className={ms.checkboxes}>
        <CheckBox
          label={"Get updates on our shop news and promotions"}
          isActive={user.getUpdates}
          handleClick={handleClick}
        />
        <CheckBox
          label={"admin-mode"}
          isActive={isActiveAdminMode}
          handleClick={() => {
            setAdminMode(!isActiveAdminMode);
          }}
        />
      </section>

      <Button width={460} text={"Continue"} handleSubmit={signIn} />
    </div>
  );
};
