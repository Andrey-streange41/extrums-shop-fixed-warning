import React from 'react';
import ms from './style.module.scss';
import basket from '../../../assets/images/Group.png';
import logo from '../../../assets/images/Logo.png';
import {Link} from 'react-router-dom'

export const AuthHeader = () => {
  return (
    <div className={ms.container}>
        <Link to={'/'}>
            <img src={basket} alt="basket" />
        </Link>
        <Link to={'/'}>
            <img className={ms.container__logo} src={logo} alt="logo" />
        </Link>
       
    </div>
  )
}
