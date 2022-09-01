import React, { useEffect } from "react";
import Header from "../../components/Header/Header.jsx";
import { NavBar } from "../../components/NavBar/index.jsx";
import ms from "./style.module.scss";
import { Footer } from "../../components/Footer/index.jsx";
import { kickUserThunk } from "../../app/slices/userSlice.ts";
import blocked from "../../assets/images/baned.webp";
import { unlockUserThunk } from "../../app/slices/userSlice.ts";
import { changeUserRoleThunk } from "../../app/slices/userSlice.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";



export const ShowUsers = () => {
  const users = useAppSelector((s:RootState) => s.user.users);
  const dispatch = useAppDispatch();

  const kickUser = (el) => {
    dispatch(kickUserThunk(el.id));
  };
  const unlockUser = (el) => {
    dispatch(unlockUserThunk(el.id));
  };

  const role = useAppSelector((s:RootState) => s.user.userData.role);
  const nav = useNavigate();

  useEffect(() => {
    if (role === "USER") {
      nav("/");
    }
    
    console.log(users);
    
 }, [users,role,nav]);

  return (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <section className={ms.container__field__content}>
            <h1>Users</h1>
            <ul className={ms.container__field__content__cardList}>
              {users?.map((el) => (
                <li
                  key={Math.random().toString().substring(3, 10)}
                  className={ms.container__field__content__cardList__card}
                >
                  {el.user_info.avatar?
                  <img
                    className={
                      ms.container__field__content__cardList__card__avatar
                    }
                    src={`http://localhost:5000/` + el?.user_info?.avatar}
                    alt="avatar"
                  /> :null}
                  
                  <h2>{el?.user_info?.firstname}</h2>
                  <h3
                    style={{ color: el?.role === "ADMIN" ? "green" : "black" }}
                  >
                    {el.role}
                  </h3>
                  <section
                    className={
                      ms.container__field__content__cardList__card__actions
                    }
                  >
                    <i className={ms.kick} onClick={() => kickUser(el)} />
                    <i className={ms.unlock} onClick={() => unlockUser(el)} />
                    <i
                      className={ms.up}
                      onClick={() => {
                        dispatch(
                          changeUserRoleThunk({ role: "ADMIN", id: el.id })
                        );
                      }}
                    />
                    <i
                      className={ms.demote}
                      onClick={() => {
                        dispatch(
                          changeUserRoleThunk({ role: "USER", id: el.id })
                        );
                      }}
                    />
                  </section>
                  {el?.blocked_user ? (
                    <img className={ms.baned} src={blocked} alt={'block'}/>
                  ) : null}
                </li>
              ))}
            </ul>
            <span>Thats all ...</span>
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};
