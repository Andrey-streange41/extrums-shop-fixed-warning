import React, { ChangeEvent, useEffect, useState, FC } from "react";
import { Footer } from "../../components/Footer";
import Header from "../../components/Header/Header.jsx";
import { NavBar } from "../../components/NavBar";
import ms from "./style.module.scss";
import avatar from "../../assets/images/Avatar.png";
import { Input } from "../../components/UI/Input/Input.tsx";
import { CheckBox } from "../../components/UI/CheckBox/CheckBox.tsx";
import { Button } from "../../components/UI/Button/index.tsx";
import { setUserData, updateUser } from "../../app/slices/userSlice.ts";
import jwt_decode from "jwt-decode";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  setAuth,
  getUserByIdChunck,
} from "../../app/slices/userSlice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

const nameRegex = /^[A-Za-z]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const phone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
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
      " password -> Minimum eight characters, at least one letter and one number, and Latin!"
    ),
  tel: yup
    .string()
    .min(10)
    .max(10)
    .required()
    .matches(phone, "tel number have invalid format!"),
});

interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  password: string;
  passwordConfirm: string;
  updateAgrements: boolean;
  avatar: any;
  id: string;
}

export interface IError {
  name: string;
  error: boolean;
  message: string | null;
}

export const AccountInfo: FC = () => {
  const userData = useAppSelector((s: RootState) => s.user.userData);
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const [sendingURL, setSendingURL] = useState<string | null>();
  const [user, setUser] = useState<IUser>({
    firstname: "",
    lastname: "",
    email: "",
    tel: "",
    password: "",
    passwordConfirm: "",
    updateAgrements: false,
    avatar: avatar,
    id: "",
  });
  const [errors, setErrors] = useState<IError[]>([
    { name: "firstname", error: true, message: "" },
    { name: "lastname", error: false, message: "" },
    { name: "email", error: true, message: "" },
    { name: "password", error: false, message: "" },
    { name: "tel", error: true, message: "" },
  ]);
  const isAuth = useAppSelector((s: RootState) => s.user.isAuth);

  useEffect(() => {
    if (!isAuth) nav("/login");
    else {
      
      dispatch(getUserByIdChunck(jwt_decode<any>(String(localStorage.getItem('token'))).id))
      .then((data)=>{
        const {firstname,lastname,avatar,telphone} = data.payload.userInfo;
         setUser({
        ...user,
        avatar: 'http://localhost:5000/'+avatar,
        firstname:firstname,
        lastname: lastname,
        email: data.payload.user.email,
        tel: telphone,
        password:jwt_decode<any>(String(localStorage.getItem('token'))).password,
        passwordConfirm:jwt_decode<any>(String(localStorage.getItem('token'))).password
      });
      }
      )
      
    }
  }, [isAuth,dispatch,nav,user]);

  const handleSelectFile = (e: ChangeEvent<any>) => {
    dispatch(
      setUserData({
        ...userData,
        avatar: window.URL.createObjectURL(e.target.files[0]),
      })
    );
    setSendingURL(e.target.files[0]);
    setUser({...user,avatar:window.URL.createObjectURL(e.target.files[0])});
    
    
  };
  const handleClick = () => {
    setUser({ ...user, updateAgrements: !user.updateAgrements });
  };
  const handleChange = (e: ChangeEvent<Input>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
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

  const handleSubmit = async () => {
    try {
      resetError();
      const result = await schema.validate(user);

      if (result) {
        if (user.password !== user.passwordConfirm) {
          const buffer: IError[] = errors.map((el: IError) => {
            if (el.name === "password") {
              el.message = "Password must be a similar , try agan !";
              el.error = true;
            }
            return el;
          });
          setErrors(buffer);
          return;
        } else {
          const buffer: IError[] = errors.map((el: IError) => {
            if (el.name === "password") {
              el.message = null;
              el.error = false;
            }
            return el;
          });
          setErrors(buffer);
        }

        

        const id = jwt_decode<any>(String(localStorage.getItem("token"))).id;
        const formData = new FormData();
        formData.append("firstname", user.firstname);
        formData.append("agrements", user?.updateAgrements);
        formData.append("lastname", user.lastname);
        formData.append("tel", user.tel);
        formData.append("email", user.email);
        formData.append("password", user.password);
        formData.append("avatar", sendingURL);
        formData.append("id", JSON.stringify(id));

        dispatch(updateUser(formData))
          .unwrap()
          .then((data: any) => {
            localStorage.setItem("token", data);
          });
      }
    } catch (err) {
      console.log(err.message);

      resetError();
      if (String(err.message).includes("password")) {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "password") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (
        String(err.message).includes("Only English letters firstname")
      ) {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "firstname") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (
        String(err.message).includes("Only English letters lastname")
      ) {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "lastname") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("email")) {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "email") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (user.firstname === "" || user.lastname === "") {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "firstname" || el.name === "lastname") {
            el.message = "First name and last name is required !";
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("tel")) {
        const buffer: IError[] = errors.map((el: IError) => {
          if (el.name === "tel") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      }
    }
  };

  const logout = () => {
    dispatch(setAuth(false));
    localStorage.removeItem("token");
    nav("/");
    dispatch(getUserByIdChunck());
  };

  return (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <section className={ms.container__field__content}>
            <h1>Account Setting</h1>
            <section className={ms.container__field__content__body}>
              <section className={ms.container__field__content__body__avatar}>
                <img
                  src={
                    String(user.avatar).includes("null") || !user.avatar
                      ? avatar
                      : user.avatar
                  }
                  alt="avatar.png"
                />
                <section
                  className={ms.container__field__content__body__avatar__button}
                >
                  Change Foto
                  <input
                    accept=".jpg, .jpeg, .png .webp"
                    type="file"
                    className={ms.selectFile}
                    name={"avatarFile"}
                    onChange={handleSelectFile}
                  />
                </section>
              </section>
              <section className={ms.container__field__content__body__form}>
                <Input
                  error={errors.find((el) => el.name === "firstname")}
                  value={user.firstname}
                  name={"firstname"}
                  handleChange={handleChange}
                  type={"text"}
                  label={"First name"}
                />
                <Input
                  error={errors.find((el) => el.name === "lastname")}
                  value={user.lastname}
                  name={"lastname"}
                  handleChange={handleChange}
                  type={"text"}
                  label={"Last name"}
                />
                <Input
                  error={errors.find((el) => el.name === "email")}
                  value={user.email}
                  name={"email"}
                  handleChange={handleChange}
                  type={"email"}
                  label={"Email address"}
                />
                <Input
                  error={errors.find((el) => el.name === "tel")}
                  value={user.tel}
                  name={"tel"}
                  handleChange={handleChange}
                  type={"tel"}
                  label={"Phone"}
                />
                <Input
                  error={errors.find((el) => el.name === "password")}
                  value={user.password}
                  name={"password"}
                  handleChange={handleChange}
                  type={"password"}
                  label={"New password"}
                />
                <Input
                  value={user.passwordConfirm}
                  name={"passwordConfirm"}
                  handleChange={handleChange}
                  type={"password"}
                  label={"Password confirmation"}
                />
                <CheckBox
                  isActive={user.updateAgrements}
                  handleClick={handleClick}
                  label="Get updates on our shop news and promotions"
                />
                <Button handleSubmit={handleSubmit} text="Save All Changes" />
                <section onClick={logout} className={ms.logout}>
                  Logout
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};
