import React, { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import ms from "./style.module.scss";
import Header from "../../components/Header/Header.jsx";
import { NavBar } from "../../components/NavBar/index.jsx";
import { Footer } from "../../components/Footer/index.jsx";
import selectImg from "../../assets/images/selectImg.png";
import { SelectedImagesList } from "../../components/SelectedImagesList/index.tsx";
import { Input } from "../../components/UI/Input/Input.tsx";
import { ListView } from "../../components/UI/ListView/index.tsx";
import { modalItems } from "../../localDB/index.ts";
import { SelectedCharacteristicsList } from "../../components/SelectedCharacteristicList/index.tsx";
import { Button } from "../../components/UI/Button/index.tsx";
import { addProduct } from "../../http/productApi.ts";
import { KeyValueInput } from "../../components/UI/KeyValueInput/index.tsx";
import { useNavigate } from "react-router-dom";
import { IError } from "../AccountInfo";
import { CheckBox } from "../../components/FilterMenu/CheckBox/index.tsx";
import * as yup from "yup";
import { IPurpose } from "../../types/favoriteList.types";
import { useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

const nameRegex = /^[A-Za-z]+$/;

let schema = yup.object().shape({
  title: yup
    .string()
    .max(20)
    .required()
    .matches(nameRegex, "Only English letters title!"),
  price: yup.number().required(),
});
export interface IChar {
  name: string;
  info: string;
}
export const AddProduct: FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [categories] = useState<string[]>(
    modalItems.map((el: any) => el.title)
  );
  const [activeCategory, setActiveCategory] = useState<string>("Select");
  const [activeSubCategory, setActiveSubCategory] = useState<string>("Select");
  const [selectedCharacteristicsList, setCharacteristicsList] = useState<IChar[]>(
    []
  );
  const [errors, setErrors] = useState<IError[]>([
    { name: "title", error: false, message: "" },
    { name: "price", error: false, message: "" },
    { name: "description", error: false, message: "" },
  ]);

  const [characteristick, setCharacteristick] = useState<IChar>({
    name: "",
    info: "",
  });
  const [purposeList, setPurposeList] = useState<string[]>([]);
  interface IProudctInfo {
    title: string;
    price: number;
    discription: string;
  }
  const [productInfo, setProductInfo] = useState<IProudctInfo>({
    title: "",
    price: 0,
    discription: "",
  });

  const resetError = () => {
    const buffer: IError[] = errors.map((el: IError) => {
      if (el.name === "title") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer);
    const buffer2: IError[] = errors.map((el: IError) => {
      if (el.name === "price") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer2);
    const buffer3: IError[] = errors.map((el: IError) => {
      if (el.name === "description") {
        el.message = null;
        el.error = false;
      }
      return el;
    });
    setErrors(buffer3);
  };

  const role = useAppSelector((s: RootState) => s.user.userData.role);
  const nav = useNavigate();

  useEffect(() => {
    if (role === "USER") {
      nav("/");
    }
  }, [role, nav]);
  useEffect(() => {
    setSubCategories(
      modalItems
        .find((el: any) => el.title === activeCategory)
        ?.items.map((el: any) => el.category)
    );
    setActiveSubCategory("Select");
  }, [activeCategory]);

  const handleClickListView = (e: MouseEvent<HTMLLIElement>) => {
    if (categories.includes(e.target.innerHTML)) {
      setActiveCategory(e.target.innerHTML);
    } else {
      setActiveSubCategory(e.target.innerHTML);
    }
  };
  const addCharacteristic = async(item: IChar) => {
    if(selectedCharacteristicsList.length>0 && (selectedCharacteristicsList.findIndex((el:IChar)=>el.name === item.name)> -1))
    return;
      setCharacteristicsList([...selectedCharacteristicsList, item]);
      setCharacteristick({ name: "", info: "" });
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductInfo({ ...productInfo, [e.target.name]: e.target.value });
  };

  const handleSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files === null) return;
    setImages([...images, e.target.files[0]]);
  };
  const removeImage = (img) => {
    setImages(images.filter((el:File) => el.name !== img.name));
  };
  const sendData = async () => {
    try {
      resetError();
      await schema.validate(productInfo);
      if (images.length <= 0) {
        alert("Select images for product , this  is required options !");
        return;
      }
      if (!activeCategory || activeCategory === "Select") {
        alert("Select category for product , this  is required options !");
        return;
      }
      if (!productInfo) {
        alert("Add product info for product , this  is required options !");
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < images.length; i++) {
        const element = images[i];
        formData.append("files", element);
      }
      formData.append("categori", activeCategory);
      formData.append("subCategory", activeSubCategory);
      formData.append(
        "characteristics",
        JSON.stringify(selectedCharacteristicsList)
      );
      formData.append("productInfo", JSON.stringify(productInfo));
      formData.append("purpose", JSON.stringify(purposeList));
      addProduct(formData);
    } catch (err) {
      resetError();
      if (String(err.message).includes("title")) {
        const buffer: IError[] = errors.map((el:IError) => {
          if (el.name === "title") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("price")) {
        const buffer: IError[] = errors.map((el:IError) => {
          if (el.name === "price") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      } else if (String(err.message).includes("description")) {
        const buffer: IError[] = errors.map((el:IError) => {
          if (el.name === "description") {
            el.message = err.message;
            el.error = true;
          }
          return el;
        });
        setErrors(buffer);
      }
      console.log(err);
    }
  };

  const removeCharacter = (name: string) => {
    setCharacteristicsList(
      selectedCharacteristicsList?.filter((el: any) => el.name !== name)
    );
  };
  const subMenu = useAppSelector((s: RootState) => s.navBar.subMenu);
  const handleSelectPurpose = (purposeItem) => {
    if (purposeItem.isActive) {
      setPurposeList([...purposeList, purposeItem.text]);
    } else {
      setPurposeList(purposeList.filter((el) => el !== purposeItem.text));
    }
  };

  return (
    <>
      <section className={ms.container}>
        <Header />
        <section className={ms.container__field}>
          <NavBar />
          <section className={ms.container__field__content}>
            <h1>Add Product</h1>
            <section className={ms.container__field__content__row}>
              <section className={ms.container__field__content__row__col}>
                <h2>Add Images</h2>
                <section
                  className={ms.container__field__content__row__col__imgArea}
                >
                  <img src={selectImg} alt={"selectFile"} />
                  <span>Select Files...</span>
                  <input onChange={handleSelectFile} type="file" />
                </section>
                <SelectedImagesList removeItem={removeImage} images={images} />
              </section>
              <section className={ms.container__field__content__row__col}>
                <section
                  className={ms.container__field__content__row__col__inputs}
                >
                  <Input
                    error={errors.find((el) => el.name === "title")}
                    name={"title"}
                    value={productInfo.title}
                    handleChange={handleChange}
                    label={"Product Name"}
                  />
                  <Input
                    error={errors.find((el) => el.name === "price")}
                    name={"price"}
                    value={productInfo.price}
                    handleChange={handleChange}
                    label={"Price"}
                  />
                  <ListView
                    label={"category"}
                    selectedItem={activeCategory}
                    onClick={handleClickListView}
                    list={categories}
                  />
                  <ListView
                    label={"Sub category"}
                    selectedItem={activeSubCategory}
                    onClick={handleClickListView}
                    list={subCategories}
                  />
                  <span
                    className={
                      ms.container__field__content__row__col__inputs__descriptionLabel
                    }
                  >
                    Desription
                  </span>
                  <textarea
                    onChange={handleChange}
                    name={"discription"}
                    value={productInfo.discription}
                    maxLength={420}
                    className={
                      ms.container__field__content__row__col__inputs__detail
                    }
                  ></textarea>
                  <span
                    className={
                      ms.container__field__content__row__col__inputs__descriptionLabel
                    }
                  >
                    Characteristics
                  </span>

                  <KeyValueInput
                    name={characteristick.name}
                    info={characteristick.info}
                    add={addCharacteristic}
                  />
                  <SelectedCharacteristicsList
                    removeCharacter={removeCharacter}
                    list={selectedCharacteristicsList}
                  />
                  {subMenu.find((el) => el.text === activeCategory) ? (
                    <h2>Purposes:</h2>
                  ) : null}
                  <section
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      marginBottom: "2em",
                    }}
                  >
                    {subMenu.find((el) => el.text === activeCategory)
                      ? subMenu
                          .find((el) => el.text === activeCategory)
                          ?.purpose.map((item: IPurpose) => (
                            <CheckBox
                              handleSelect={handleSelectPurpose}
                              key={item.name}
                              item={{ ...item, text: subMenu.text }}
                            />
                          ))
                      : null}
                  </section>
                </section>
              </section>
            </section>
            <Button handleSubmit={sendData} text={"Publish product"} />
          </section>
        </section>
      </section>
      <Footer />
    </>
  );
};
