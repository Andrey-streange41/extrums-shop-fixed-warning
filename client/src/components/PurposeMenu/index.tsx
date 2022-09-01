import React, { FC } from "react";
import ms from "./style.module.scss";
import { Input } from "../UI/Input/Input.tsx";

interface IPurposeMenu {
  add: (tag:string) => {};
  tagName: string;
  onChange: () => {};
}

export const PurposeMenu: FC<IPurposeMenu> = ({ add, tagName, onChange }) => {
  return (
    <section className={ms.container}>
      <Input
        type={"text"}
        handleChange={onChange}
        value={tagName}
        label={"Tag name"}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={ms.container__addButton}
        onClick={() => add(tagName)}
      >
        <path
          fill="#000000"
          d="M17,13H13V17H11V13H7V11H11V7H13V11H17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
        />
      </svg>
    </section>
  );
};
