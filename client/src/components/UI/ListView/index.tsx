import React, { FC, useEffect, useState } from 'react';
import ms from './style.module.scss';

interface IListViewProps{
  list:string[],
  onClick:()=>{},
  selectedItem:string;
  label:string
}

export const ListView:FC<IListViewProps> = ({ list,onClick,selectedItem,label }) => {
  const [isOpen, setOpen] = useState(false);
  
 
  
  return (
    <div className={ms.container}>
      <label className={ms.container__myLabel} htmlFor="input">{label}</label>
      <section id={'input'} className={ms.container__myInput}>
        <span>{selectedItem}</span>
        <img src={isOpen ?
         require('../../../assets/images/birdUpModal.png') 
        : require('../../../assets/images/birdDown.png')} alt="bird" 
        onClick={()=>setOpen(!isOpen)}
        />
      </section>
      <ul className={isOpen?ms.container__modal + ' ' + ms.active:ms.container__modal }>
        {list?.map(el => <li onMouseUp={()=>setOpen(false)} key={el} onClick={onClick}>{el}</li>)}
      </ul>
    </div>
  )
}
