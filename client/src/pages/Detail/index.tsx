import React, { FC, useState, useEffect, ChangeEvent } from "react";
import { Chart } from "react-google-charts";
import { useParams, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPencil } from "@fortawesome/free-solid-svg-icons";
// local imports
import { Footer } from "../../components/Footer/index.jsx";
import Header from "../../components/Header/Header.jsx";
import { ProductImagesSlider } from "../../components/ProductImagesSlider/index.tsx";
import { NavBar } from "../../components/NavBar/index.jsx";
import ms from "./style.module.scss";
import { userCommunication } from "../../assets/images/index.js";
import birka from "../../assets/images/birka.png";
import { CommentsList } from "./CommentsList/index.tsx";
import {
  updateProductsThunk,
  addToFavoritesThunk,
  removeFromFavoriteListThunk,
  updateProductInfoThunk,
  addProductInfoThunk,
  addCharacteristicThunk,
  removeProductThunk,
} from "../../app/slices/productsListSlice.ts";
import Loader from "../../components/Loader/index.tsx";
import {
  IProduct,
  IUserInterfaceItem,
} from "../../types/favoriteList.types.js";
import { CharacteristicItem } from "./CharacteristicItem/index.tsx";
import { KeyValueInput } from "../../components/UI/KeyValueInput/index.tsx";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

export const Detail: FC = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<IProduct>();
  const [coms, setComs] = useState<IUserInterfaceItem[]>([]);
  const [editing, setEditing] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(item?.title || "");
  const [price, setPrice] = useState<number>(item?.price || 0);
  const [priceEditing, setPriceEditing] = useState<boolean>(false);
  const [editingChar, setEditingChar] = useState<boolean>(false);
  const [isEditDiscount, setEditingDiscount] = useState<boolean>(false);
  const [discountPrice, setDiscountPrice] = useState<number>(0);

  const role = useAppSelector((s:RootState) => s.user.userData.role);
  const user = useAppSelector((s:RootState) => s.user.userData);
  const loading = useAppSelector((s:RootState) => s.productsList.loading);
  const isAuth = useAppSelector((s:RootState) => s.user.isAuth);
  const productList = useAppSelector((s:RootState) => s.productsList.testList);

  const handleFavoriteClick = () => {
    if (!isAuth) {
      alert("You must sign in to you account for this option !");
      return;
    }
    dispatch(
      updateProductsThunk({
        name: "favorites",
        id: item?.id,
      })
    )
      .then((data: any) => {
        const favoriteState = data.payload
          .find((el: IProduct) => el.id === item?.id)
          .userComunications.find(
            (el: IUserInterfaceItem) => el.name === "favorites"
          ).isActive;
        if (favoriteState === true) {
          dispatch(
            addToFavoritesThunk({ productId: item?.id, userId: user.id })
          );
        } else {
          dispatch(
            removeFromFavoriteListThunk({
              productId: item?.id,
              userId: user.id,
            })
          );
        }
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  interface IChars {
    name: string;
    info: string;
  }
  const handleCharAdding = (chars: IChars) => {
    setEditingChar(false);
    dispatch(
      addCharacteristicThunk({ key: chars.name, value: chars.info, id: id })
    );
  };

  useEffect(() => {
    setItem(productList?.filter((item: IProduct) => item.id === Number(id))[0]);
    setTitle(String(item?.title));
    setPrice(Number(item?.price));
    setDiscountPrice(Number(item?.discountPrice));

    if (loading === "idle") {
      setComs(
        [
          ...productList.filter((item: IProduct) => item.id === Number(id))[0]
            ?.userComunications,
        ]?.sort((a, b) => {
          return String(a.name).localeCompare(b.name);
        })
      );
    }
  }, [item?.id, loading, item?.title, item?.price, item?.discountPrice,id,productList]);

  return loading === "penging" || !item ? (
    <section className={ms.loader}>
      <Header />
      <Loader />
      <h1>Loading...</h1>
    </section>
  ) : (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <section className={ms.container__field__content}>
            <section className={ms.container__field__content__row1}>
              <section className={ms.container__field__content__row1__galery}>
                <section
                  className={ms.container__field__content__row1__galery__swiper}
                >
                  <ProductImagesSlider
                    id={item.id}
                    images={
                      item?.images ? JSON.parse(String(item?.images)) : []
                    }
                  />
                </section>
                {role === "ADMIN" ? (
                  <button className={ms.addImage}>
                    <input
                      type="file"
                      onChange={(e) => {
                        const formData = new FormData();
                        if (e.target.files?.length) {
                          formData.append("newImage", e.target.files[0]);
                          formData.append("id", JSON.stringify(id));
                          dispatch(addProductInfoThunk(formData));
                        }
                      }}
                    />
                    Add Image
                  </button>
                ) : null}
              </section>

              <section className={ms.container__field__content__row1__cardInfo}>
                <section
                  className={ms.container__field__content__row1__cardInfo__UI}
                >
                  {coms?.map((el, index) => (
                    <section
                      key={index}
                      className={
                        ms.container__field__content__row1__cardInfo__UI__item
                      }
                    >
                      <img
                        onClick={
                          el.name === "likes"
                            ? () => {
                                if (!isAuth) {
                                  alert(
                                    "You must sign in to you account for this option !"
                                  );
                                  return;
                                }
                                dispatch(
                                  updateProductsThunk({
                                    name: "likes",
                                    id: item.id,
                                  })
                                );
                              }
                            : el.name === "dislikes"
                            ? () => {
                                if (!isAuth) {
                                  alert(
                                    "You must sign in to you account for this option !"
                                  );
                                  return;
                                }
                                dispatch(
                                  updateProductsThunk({
                                    name: "dislikes",
                                    id: item.id,
                                  })
                                );
                              }
                            : el.name === "favorites"
                            ? handleFavoriteClick
                            : () => {}
                        }
                        src={
                          el.name === "likes" && el.isActive
                            ? userCommunication[4]
                            : el.name === "likes" && !el.isActive
                            ? userCommunication[0]
                            : el.name === "dislikes" && el.isActive
                            ? userCommunication[1]
                            : el.name === "dislikes" && !el.isActive
                            ? userCommunication[5]
                            : el.name === "favorites" && el.isActive
                            ? userCommunication[2]
                            : el.name === "favorites" && !el.isActive
                            ? userCommunication[6]
                            : userCommunication[3]
                        }
                        alt={"UI.png"}
                        className={
                          el.name === "likes" ||
                          el.name === "dislikes" ||
                          el.name === "favorites"
                            ? ms.scaleUp
                            : ""
                        }
                      />
                      <span>{el.amount}</span>
                    </section>
                  ))}
                </section>
                <h2
                  className={
                    ms.container__field__content__row1__cardInfo__title
                  }
                >
                  <section
                    className={
                      ms.container__field__content__row1__cardInfo__title__block
                    }
                  >
                    <span className={editing ? ms.dNone : ms.dFlex}>
                      {title}
                    </span>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={
                        ms.container__field__content__row1__cardInfo__title__block__titleEdit +
                        " " +
                        (editing ? ms.dFlex : ms.dNone)
                      }
                    />
                    {role === "ADMIN" ? (
                      <>
                        {" "}
                        <FontAwesomeIcon
                          className={
                            ms.pencil + " " + (!editing ? ms.dFlex : ms.dNone)
                          }
                          icon={faPencil}
                          onClick={() => {
                            setEditing(true);
                          }}
                        />
                        <FontAwesomeIcon
                          id="save"
                          className={
                            ms.save + " " + (editing ? ms.dFlex : ms.dNone)
                          }
                          icon={faFloppyDisk}
                          onClick={() => {
                            setEditing(false);
                            dispatch(
                              updateProductInfoThunk({
                                id: item.id,
                                title: title,
                              })
                            );
                          }}
                        />
                      </>
                    ) : null}
                  </section>
                </h2>
                <section
                  className={
                    ms.container__field__content__row1__cardInfo__addInfo
                  }
                >
                  {item?.characteristics.map((el) => (
                    <CharacteristicItem
                      key={Math.random().toString().substring(5, 10)}
                      el={el}
                      item={item}
                    />
                  ))}
                </section>

                {role === "ADMIN" ? (
                  <button
                    className={ms.addImage}
                    onClick={() => {
                      if (!editingChar) {
                        setEditingChar(true);
                      }
                    }}
                  >
                    Add Property
                  </button>
                ) : null}
                <section className={editingChar ? ms.dFlex : ms.dNone}>
                  <KeyValueInput add={handleCharAdding} />
                </section>

                <section
                  className={
                    ms.container__field__content__row1__cardInfo__price
                  }
                >
                  {role === "ADMIN" ? (
                    <>
                      {" "}
                      <button
                        className={
                          ms.addImage +
                          " " +
                          (discountPrice > 0 ? ms.dFlex : ms.dNone)
                        }
                        onClick={() => {
                          dispatch(
                            updateProductInfoThunk({
                              price,
                              discountPrice: 0,
                              id,
                            })
                          );
                        }}
                      >
                        Drop Discount
                      </button>
                      <button
                        className={
                          ms.addImage +
                          " " +
                          (!isEditDiscount ? ms.dFlex : ms.dNone)
                        }
                        onClick={() => {
                          setEditingDiscount(true);
                        }}
                      >
                        Edit Discount
                      </button>
                    </>
                  ) : null}

                  <input
                    value={discountPrice}
                    onChange={(e:ChangeEvent<HTMLInputElement>) => {
                      if (
                        Number(e.target.value) !== NaN &&
                        !Number.isNaN(Number(e.target.value))
                      ) {
                        setDiscountPrice(Number(e.target.value));
                      }
                    }}
                    type="text"
                    className={isEditDiscount ? ms.dFlex : ms.dNone}
                  />
                  <FontAwesomeIcon
                    id="save"
                    className={
                      ms.save + " " + (isEditDiscount ? ms.dFlex : ms.dNone)
                    }
                    icon={faFloppyDisk}
                    onClick={() => {
                      setEditingDiscount(false);
                      dispatch(
                        updateProductInfoThunk({ price, discountPrice, id })
                      );
                    }}
                  />
                  <span
                    className={
                      ms.oldPrice +
                      " " +
                      (discountPrice > 0 ? ms.dFlex : ms.dNone)
                    }
                  >
                    {price}
                  </span>
                  <img src={birka} alt="birka.png" />
                  <span
                    className={
                      (discountPrice > 0 && !isEditDiscount
                        ? ms.discountPrice
                        : null) +
                      " " +
                      (!priceEditing ? ms.dFlex : ms.dNone)
                    }
                  >
                    ${discountPrice > 0 ? discountPrice : price}
                  </span>
                  <input
                    type="text"
                    maxLength={10}
                    className={priceEditing ? ms.dFlex : ms.dNone}
                    value={price}
                    onChange={(e) => {
                      if (
                        Number(e.target.value) !== NaN &&
                        !Number.isNaN(Number(e.target.value))
                      ) {
                        setPrice(Number(e.target.value));
                      }
                    }}
                  />
                  {role === "ADMIN" ? (
                    <>
                      <FontAwesomeIcon
                        className={
                          ms.pencil +
                          " " +
                          (!priceEditing ? ms.dFlex : ms.dNone)
                        }
                        icon={faPencil}
                        onClick={() => {
                          setPriceEditing(true);
                        }}
                      />
                      <FontAwesomeIcon
                        id="save"
                        className={
                          ms.save + " " + (priceEditing ? ms.dFlex : ms.dNone)
                        }
                        icon={faFloppyDisk}
                        onClick={() => {
                          setPriceEditing(false);
                          dispatch(
                            updateProductInfoThunk({
                              id: item.id,
                              price: price,
                            })
                          );
                        }}
                      />
                    </>
                  ) : null}
                </section>
              </section>
            </section>
            <section className={ms.container__field__content__row2}>
              {<Menu item={item} />}
            </section>
            <section className={ms.container__field__content__row2__delete}>
              {role === "ADMIN" ? (
                <button
                  className={ms.addImage}
                  onClick={() => {
                    dispatch(removeProductThunk(id));
                    nav("/catalog");
                  }}
                >
                  Delete Product
                </button>
              ) : null}
            </section>
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};

interface IMenuProps {
  item: IProduct;
}

const Menu: FC<IMenuProps> = ({ item }) => {
  let [menuItems, setItems] = useState([
    {
      id: 1,
      isActive: true,
      text: "Description",
      modal: <FullInfo item={item} />,
    },
    {
      id: 2,
      isActive: false,
      text: "Characteristics",
      modal: <Characteristics item={item} />,
    },
    {
      id: 3,
      isActive: false,
      text: `Comments (${item?.comments.length})`,
      modal: <CommentsList item={item} />,
    },
    {
      id: 4,
      isActive: false,
      text: "Price dynamics",
      modal: <ViewsChart item={item} />,
    },
  ]);

  return (
    <>
      <ul className={ms.container__field__content__row2__menu}>
        {menuItems.map((el, index) => (
          <li
            key={index}
            className={el.isActive ? ms.active : ""}
            onClick={() => {
              let tmp = [...menuItems];
              for (let i = 0; i < tmp.length; i++) {
                const element = tmp[i];
                element.isActive = false;
              }
              tmp[index].isActive = true;
              setItems(tmp);
            }}
          >
            {index === 2 ? (
              <span>{`Comments (${item?.comments.length})`}</span>
            ) : (
              el.text
            )}
          </li>
        ))}
      </ul>
      {menuItems[menuItems.findIndex((el) => el.isActive)].modal}
    </>
  );
};

interface IFullInfoProps {
  item: IProduct;
}

const FullInfo: FC<IFullInfoProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const [active, setActive] = useState<boolean>(true);
  const [text, setText] = useState<string>(item.full_info);
  const role = useAppSelector((s) => s.user.userData.role);

  return (
    <section className={ms.descrSection}>
      <p
        className={
          ms.container__field__content__row2__textInfo +
          " " +
          (active ? ms.dFlex : ms.dNone)
        }
      >
        {text}
      </p>
      <textarea
        onChange={(e) => setText(e.target.value)}
        cols={80}
        className={
          ms.container__field__content__row2__textInfo +
          " " +
          (!active ? ms.dFlex : ms.dNone)
        }
        id="area"
        value={text}
      ></textarea>

      {role === "ADMIN" ? (
        <label className={ms.editIconBlock} htmlFor="area">
          <FontAwesomeIcon
            className={ms.edit + " " + (active ? ms.dFlex : ms.dNone)}
            icon={faPencil}
            onClick={() => setActive(!active)}
          />
          <label className={active ? ms.dFlex : ms.dNone}>Edit</label>
        </label>
      ) : null}

      <section className={ms.editIconBlock}>
        <FontAwesomeIcon
          id="save"
          className={ms.save + " " + (!active ? ms.dFlex : ms.dNone)}
          icon={faFloppyDisk}
          onClick={() => {
            setActive(!active);
            dispatch(
              updateProductInfoThunk({ description: text, id: item.id })
            );
          }}
        />
        <label className={!active ? ms.dFlex : ms.dNone} htmlFor="save">
          Save
        </label>
      </section>
    </section>
  );
};

interface ICharsProps {
  item: IProduct;
}

const Characteristics: FC<ICharsProps> = ({ item }) => {
  return (
    <>
      <section className={ms.container__field__content__row2__characteristics}>
        <section
          className={
            ms.container__field__content__row2__characteristics__leftMenu
          }
        >
          {item?.characteristics?.map((item, index) => {
            if (index > 2) {
              return null;
            }
            return (
              <section
                key={Math.random()}
                className={
                  ms.container__field__content__row2__characteristics__leftMenu__row
                }
              >
                <span
                  className={
                    ms.container__field__content__row2__characteristics__leftMenu__name
                  }
                >
                  {item?.name}:
                </span>
                <span className="">{item?.info}.</span>
              </section>
            );
          })}
        </section>
        <section
          className={
            ms.container__field__content__row2__characteristics__rightMenu
          }
        >
          {item?.characteristics?.map((item, index) => {
            if (index <= 2) {
              return null;
            }
            return (
              <section
                key={Math.random()}
                className={
                  ms.container__field__content__row2__characteristics__leftMenu__row
                }
              >
                <span
                  className={
                    ms.container__field__content__row2__characteristics__leftMenu__name
                  }
                >
                  {item?.name}:
                </span>
                <span>{item?.info}.</span>
              </section>
            );
          })}
        </section>
      </section>
    </>
  );
};

interface IViewCharProps {
  item: IProduct;
}

const ViewsChart: FC<IViewCharProps> = ({ item }) => {
  const [data] = useState([
    ["Month", "views"],
    ["February", Math.random() * (100000 - 0) + 0],
    ["March", Math.random() * (100000 - 0) + 0],
    ["Appril", Math.random() * (100000 - 0) + 0],
    ["May", Math.random() * (100000 - 0) + 0],
    ["June", Math.random() * (100000 - 0) + 0],
    ["July", Math.random() * (100000 - 0) + 0],
    [
      "August",
      item?.userComunications?.find(
        (el: IUserInterfaceItem) => el?.name === "views"
      )?.amount,
    ],
  ]);

  const options = {
    title: "Views",
    curveType: "function",
    legend: { position: "bottom" },
  };
  return (
    <Chart
      chartType={"LineChart"}
      width={"100%"}
      height={"400px"}
      data={data}
      options={options}
    />
  );
};
