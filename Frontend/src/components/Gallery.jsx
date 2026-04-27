import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

export default function Gallery({ images }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-surface-container-high overflow-hidden group">
        <Swiper
          style={{
            "--swiper-navigation-color": "#FA8232",
            "--swiper-pagination-color": "#FA8232",
            marginBottom: "20px",
          }}
          spaceBetween={10}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-[100%] min-w-0 rounded-[4px]"
        >
          {images &&
            images.map((img, index) => (
              <SwiperSlide
                key={index}
                className="!flex items-center justify-center min-w-0"
              >
                <img
                  alt={`Gallery image ${index + 1}`}
                  className="max-w-[90%] h-auto mx-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  src={img}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="p-1 bg-white cursor-pointer w-full">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            breakpoints={{
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 5 },
            }}
            className="w-full"
          >
            {images &&
              images.map((img, index) => (
                <SwiperSlide
                  key={index}
                  className="!flex items-center rounded justify-center min-w-0 border border-surface-container-high hover:border-primary-light transition-colors"
                >
                  <img
                    className="w-full h-auto"
                    alt={`Thumbnail ${index + 1}`}
                    src={img}
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
