import React, { FC } from "react";
import ms from "./style.module.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface IStatistickCardProps {
  item: {
    title: string;
    amount: string;
    proc: number;
    info: string;
    color: string;
  };
}

export const StatistickCard: FC<IStatistickCardProps> = ({ item }) => {
  return (
    <section style={{ background: item.color }} className={ms.container}>
      <section className={ms.container__col}>
        <h1>{item.title}</h1>
        <span className={ms.container__col__info}>{item.info}</span>
        <span className={ms.container__col__price}>{item.amount}</span>
      </section>
      <section className={ms.circular}>
        <CircularProgressbar
          value={item.proc}
          text={`${item.proc}%`}
          styles={{
            trail: {
              strokeLinecap: "butt",
              transform: "rotate(-126deg)",
              transformOrigin: "",
            },
            path: {
              stroke: "black",
              width: "2px",
            },
            text: {
              fill: "black",
              fontWeight: 1000,
              fontSize: "1.8em",
            },
          }}
          strokeWidth={10}
        />
      </section>
    </section>
  );
};
