import React, { FC } from 'react';
import ms from './style.module.scss';

interface IButtonProps{
    text:string;
    handleSubmit?:() => void;
    width?:number;
}

export const Button:FC<IButtonProps> = ({text,handleSubmit,width}) => {
  return (
    <div className={ms.container} onClick={handleSubmit} style={{minWidth:width}}>
        {text}
    </div>
  )
}


export const OutlineButton:FC<IButtonProps> = ({text,handleSubmit,width}) => {
  
  return (
    <div className={ms.container2} onClick={handleSubmit} style={{minWidth:width}}>
        {text}
    </div>
  )
}