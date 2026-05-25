import React, { useState, useEffect } from "react";
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
  const [mainSwiper, setMainSwiper] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [thumbStart, setThumbStart] = useState(0);

  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setThumbStart(0);
  }, [images, isSmallScreen]);

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
          onSwiper={setMainSwiper}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs]}
          className="w-full min-w-0 rounded-sm"
        >
          {images &&
            images.map((img, index) => (
              <SwiperSlide
                key={index}
                className="flex! items-center justify-center min-w-0"
              >
                <img
                  alt={`Gallery image ${index + 1}`}
                  className="max-w-full max-h-[60vh] h-auto mx-auto object-contain transition-transform duration-500 group-hover:scale-105"
                  src={img}
                />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <div className="p-1 bg-white cursor-pointer w-full">
          {images && images.length > 1 && (
            <>
              {isSmallScreen ? (
                <div className="flex items-center gap-2">
                  {images.length > 3 && (
                    <button
                      onClick={() => {
                        const maxStart = Math.max(0, images.length - 3);
                        setThumbStart((prev) =>
                          prev === 0 ? maxStart : prev - 1,
                        );
                      }}
                      className="p-2 bg-white rounded-full shadow-sm"
                      aria-label="Previous thumbnails"
                    >
                      <span className="material-symbols-outlined">
                        chevron_left
                      </span>
                    </button>
                  )}

                  <div className="grid grid-cols-3 gap-2 flex-1">
                    {images
                      .slice(thumbStart, thumbStart + 3)
                      .map((img, index) => (
                        <button
                          key={thumbStart + index}
                          onClick={() =>
                            mainSwiper && mainSwiper.slideTo(thumbStart + index)
                          }
                          className="p-1 bg-white rounded border border-surface-container-high hover:border-primary-light"
                        >
                          <img
                            className="w-full h-20 object-contain"
                            alt={`Thumbnail ${thumbStart + index + 1}`}
                            src={img}
                          />
                        </button>
                      ))}
                  </div>

                  {images.length > 3 && (
                    <button
                      onClick={() => {
                        const maxStart = Math.max(0, images.length - 3);
                        setThumbStart((prev) =>
                          prev >= maxStart ? 0 : prev + 1,
                        );
                      }}
                      className="p-2 bg-white rounded-full shadow-sm"
                      aria-label="Next thumbnails"
                    >
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  navigation={images.length > 4}
                  slidesPerView={Math.min(images.length, 4)}
                  breakpoints={{
                    640: { slidesPerView: Math.min(images.length, 4) },
                    1024: { slidesPerView: Math.min(images.length, 4) },
                  }}
                  className="w-full"
                >
                  {images.map((img, index) => (
                    <SwiperSlide
                      key={index}
                      className="flex items-center rounded justify-center min-w-0 border border-surface-container-high hover:border-primary-light transition-colors"
                    >
                      <img
                        className="w-full h-12 sm:h-14 md:h-16 lg:h-20 object-contain"
                        alt={`Thumbnail ${index + 1}`}
                        src={img}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
