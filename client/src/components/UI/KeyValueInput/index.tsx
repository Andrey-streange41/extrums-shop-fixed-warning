import React, { FC, useState, ChangeEvent } from "react";
import ms from "./style.module.scss";


interface IKeyValueProps {
  name?: string;
  value?: string;
  add: (characteristick:IItem) => {};
}

interface IItem{
    name: string;
    info: string;
}

export const KeyValueInput: FC<IKeyValueProps> = ({add ,name,value}) => {
  const [characteristick, setCharacteristick] = useState<IItem>({
    name: "",
    info: "",
  });
  const setCharacteristic = (e: ChangeEvent<HTMLInputElement>) => {
    setCharacteristick({ ...characteristick, [e.target?.name]: e.target?.value });
  };
  return (
    <section className={ms.characteristics}>
      
      <section className={ms.characteristics__item}>
        <span>Name:</span>
       <input value={characteristick.name}
        name="name"
        type="text"
        onChange={setCharacteristic}
      />
      </section>
      
      <section className={ms.characteristics__item}>
        <span>Value:</span>{" "}
      <input
        value={characteristick.info}
        name="info"
        type="text"
        onChange={setCharacteristic}
      />
      </section>
      <button className={ms.push} onClick={()=>add(characteristick)}>
        Push 
      </button>
     
    </section>
  );
};
