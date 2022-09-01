import React, { FC } from "react";
import ms from "./style.module.scss";
import { IChar } from "../../pages/AddProduct/index.tsx";

interface ICharacteristicsListProps {
  list: IChar[];
  removeCharacter: (name:string) => {};
}

export const SelectedCharacteristicsList: FC<ICharacteristicsListProps> = ({
  list,
  removeCharacter,
}) => {
  return (
    <ul className={ms.container}>
      {list.map((el: IChar) => (
        <li key={Math.random()} onClick={() => removeCharacter(el.name)}>
          <span>{el.name}</span>:<span>{el.info}</span>
        </li>
      ))}
    </ul>
  );
};
