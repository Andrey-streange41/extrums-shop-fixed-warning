import React from 'react';
import ms from  './style.module.scss';

export const CloudMessage = ({fullname,action, isActive,name}) => {
  return (
    <div className={isActive?ms.container:ms.dNone}>
        <div className={ms.container__triangle}></div>
        <div className={ms.container__content}>
            <span>{fullname}</span>
        </div>
        <div className={ms.container__logoutMenu}>
                <span onClick={action}>{name}</span>
        </div>
    </div>
  )
}
