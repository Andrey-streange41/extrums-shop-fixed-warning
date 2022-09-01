import React, { FC } from "react";
import ms from "./style.module.scss";

interface IPurpose {
  list: string[];
  removeTag: (element) => {};
}

export const PurposeList: FC<IPurpose> = ({ list, removeTag }) => {
  const lol = 3;
  return (
    <ul className={ms.purposeList}>
      {list.map((el:string) => (
        <li>
          {<span>{el}</span>}{" "}
          <img
            onClick={()=>removeTag(el)}
            src={String(require("../../assets/images/closeModal.png"))}
            alt="alt.png"
          />
        </li>
      ))}
    </ul>
  );
};
