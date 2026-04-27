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
    <div className="max-[400px]:w-[300px] max-[450px]:w-[400px] sm:w-[500px] md:w-full relative">
      {/* Main Gallery */}
      <div className=" relative">
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
          className="w-[100%] min-w-0 rounded-[4px] border border-[#E4E7E9]"
        >
          {images &&
            images.map((img, index) => (
              <SwiperSlide
                key={index}
                className="!flex items-center justify-center min-w-0"
              >
                <img
                  src={img}
                  alt={`Gallery image ${index + 1}`}
                  className="w-[80%] h-[250px] xs:h-[180px]  md:h-[320px] lg:h-[350px] object-contain rounded-xl"
                  style={{
                    maxHeight: "350px",
                  }}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Thumbnails - hidden on small screens */}
      <div className="hidden md:block">
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
          className="rounded-lg"
        >
          {images &&
            images.map((img, index) => (
              <SwiperSlide
                key={index}
                className="!flex items-center justify-center min-w-0"
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-16 sm:h-20 md:h-24 object-cover rounded-lg cursor-pointer border border-gray-200 hover:border-blue-500 transition"
                  style={{
                    maxWidth: "100%",
                  }}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
}