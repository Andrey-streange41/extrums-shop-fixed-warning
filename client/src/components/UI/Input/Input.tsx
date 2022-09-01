import React from 'react';
import ms from './style.module.scss';
import {IError} from '../../../pages/AccountInfo/index.tsx';


interface InputProps {
    label:string;
    type:string;
    name:string;
    value:string;
    error?:IError
    handleChange:()=>void;
}

export const Input : React.FC<InputProps>  = ({label,type,name,handleChange,value, error}) => {
   
  return (
    <section className={ms.container}>
        <label className={ms.container__myLabel}  htmlFor="input">{label}</label>
        <input name={name} id='input' value={value} onChange={handleChange} className={ms.container__myInput} type={type||'text'}/>
        <p className={error?.error?ms.container__error +' '+ ms.active:ms.container__error}>{error?.message}</p>
    </section>
  )
}



