import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ms from "./style.module.scss";
import {
  removeProductInfoThunk,
  updateProductInfoThunk,
} from "../../../app/slices/productsListSlice.ts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPencil,
  faXmark
} from "@fortawesome/free-solid-svg-icons";

export const CharacteristicItem = ({ el, item }) => {
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState<string>(el.info);
  const role = useSelector(s=>s.user.userData.role);

  return (
    <div className={ms.item}>
      <span className={ms.item__name}>{el.name}:</span>
      <section className={ms.item__container}>
        <span className={ms.item__container__info+' '+(!editing ? ms.dFlex : ms.dNone)}> {text}. </span>

         {role==='ADMIN'?
         <>
        <input
          id="pencil"
          type="text"
          className={ms.charInput + " " + (editing ? ms.dFlex : ms.dNone)}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        />

        <FontAwesomeIcon
          className={ms.remove}
          icon={faXmark}
          onClick={() => {
            dispatch(
              removeProductInfoThunk({ id: item.id, charactersKey: el.name })
            );
          }}
        />
        <label htmlFor="pencil">
          <FontAwesomeIcon
            className={ms.pencil + " " + (!editing ? ms.dFlex : ms.dNone)}
            icon={faPencil}
            onClick={() => {
              setEditing(true);
            }}
          />
        </label>
        <FontAwesomeIcon
          id="save"
          className={ms.save + " " + (editing ? ms.dFlex : ms.dNone)}
          icon={faFloppyDisk}
          onClick={() => {
            setEditing(false);
            dispatch(
              updateProductInfoThunk({
                id: item.id,
                charactersKey: el.name,
                charactersValue: text,
              })
            );
          }}
        />
        </>
          :
          <></>
      } 
      </section>
    </div>
  );
};
