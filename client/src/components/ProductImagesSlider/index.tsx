import React, { useState,FC } from "react";
import { Navigation, Thumbs } from "swiper";
import { Swiper, SwiperProps, SwiperSlide } from "swiper/react";
import "./product-images-slider.scss";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { removeProductInfoThunk } from "../../app/slices/productsListSlice.ts";
import { useAppDispatch, useAppSelector } from "../../hooks.ts";
import { RootState } from "../../app/store.ts";

interface IProductImagesSlider{
  images:string[];
  id:number;
}

export const ProductImagesSlider:FC<IProductImagesSlider> = ({ images, id }: IPropTypes) => {
  const [target, setTarget] = useState<SwiperProps | null | undefined>(); //current swipe
  const dispatch = useAppDispatch();
  const role = useAppSelector((s: RootState) => s.user.userData.role);
  return (
    <>
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: target }}
        modules={[Navigation, Thumbs]}
        grabCursor={true}
        className={"product-images-slider"}
      >
        {images?.map((i: string, index: number) => (
          <SwiperSlide key={index}>
            <img src={"http://localhost:5000/" + i} alt="product images" />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        loop={true}
        spaceBetween={10}
        onSwiper={setTarget}
        modules={[Navigation, Thumbs]}
        slidesPerView={images?.length}
        className={"product-images-slider-thumbs"}
      >
        {images?.map((i, index) => (
          <SwiperSlide key={index}>
            <section className="product-images-slider-thumbs-wrapper">
              <img
                style={{ cursor: "grab" }}
                src={"http://localhost:5000/" + i}
                alt="product images"
              />
              {role === "ADMIN" ? (
                <FontAwesomeIcon
                  className="remove"
                  icon={faXmark}
                  onClick={() => {
                    dispatch(removeProductInfoThunk({ id: id, imageId: i }));
                  }}
                />
              ) : null}
            </section>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

interface IPropTypes {
  images: string[];
  id: number;
}
