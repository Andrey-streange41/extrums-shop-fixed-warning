import React, { FC, useState } from "react";
import ms from "./style.module.scss";
import check from "../../../assets/images/check.png";
import { useDispatch } from "react-redux";
import {
  setSelectedItems,
  removeSelectedItem,
} from "../../../app/slices/modalFilterSlice.ts";

interface ICheck {
  item: {
    name: string;
    isActive: boolean;
  };
  handleSelect: (el:any) => {};
}

export const CheckBox: FC<ICheck> = ({ item, handleSelect }) => {
  const [active, setActive] = useState(false);
  const dispatch = useDispatch();

  return (
    <section className={ms.container}>
      <div
        className={
          active ? ms.container__box + " " + ms.active : ms.container__box
        }
        onClick={() => {
          if (active) {
            handleSelect({ text: item.name, isActive: false });
            setActive(false);
            dispatch(removeSelectedItem(item.name));
          } else {
            handleSelect({ text: item.name, isActive: true });
            setActive(true);
            dispatch(setSelectedItems({ name: item.name, isActive: true }));
          }
        }}
      >
        <img src={active ? check : null} alt="" />
      </div>
      <label htmlFor="">{item?.name || false}</label>
    </section>
  );
};
