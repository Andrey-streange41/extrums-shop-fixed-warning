import React, {  FC } from 'react';
import ms from './style.module.scss';


interface ICheckBoxProps {
  label:string;
  handleClick:()=>void;
  isActive:boolean;
}

export const CheckBox:FC<ICheckBoxProps> = ({label,handleClick,isActive}) => {
  
  return (
    <section className={ms.container}>
       <div id='checkbox' className={ms.container__checkbox} onClick={handleClick}>
          {isActive?<img src={String(require('../../../assets/images/check.png'))} alt="" />:null}
       </div>
       <label className={ms.container__label} htmlFor="checkbox">{label}</label>
    </section>
  )
}
