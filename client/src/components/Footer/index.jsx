import React from "react";
import ms from "./style.module.scss";
import { Link } from "react-router-dom";
import { linkList, iconsList } from "../../localDB/index.ts";
import c from '../../assets/images/c.png';
import basket from '../../assets/images/basket.png';
import title from '../../assets/images/horizontalLogo.png'

export const Footer = () => {
  return (
    <section className={ms.footer}>
    <section className={ms.container}>
      {linkList.map((item) => (
        <section className={ms.container__item} key={item.title}>
          <h3>{item.title}</h3>
          <ul className={ms.container__item__links}>
            {item.links.map((link) => (
              <Link className={ms.link} key={link.text} to={link.to}>
                <li>{link.text}</li>
              </Link>
            ))}
          </ul>
        </section>
      ))}
      <section className={ms.container__item}>
        <h3>Social media</h3>
        <section className={ms.container__item__icons}>
          {iconsList.map((icon) => (
            <a key={icon.to} href={icon.to}>
              <img src={icon.src} alt={icon.to} />
            </a>
          ))}
        </section>
      </section>
      
      
     
    </section> 

    <section className={ms.footer__logoSection}>
        <Link to={"/"}>
            <img className={ms.logo} src={basket} alt="logo" />
        </Link>
        <section>
        <Link to={"/"}>
            <img className={ms.title} src={title} alt="title" />
        </Link>
            <p>Stay home. Shop online</p>
            <section style={{display:"flex" ,flexWrap:"wrap", alignItems:"center"}}>
                <img src={c} alt="C" style={{marginRight:"5px"}}/>
                <span>Best Products 2022</span>
            </section>
        </section>
      </section>
      </section>
  );
};
