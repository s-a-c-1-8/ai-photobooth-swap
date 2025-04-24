import React, { useState, useEffect } from "react";

const CharacterCard = ({ gender = "Male", onSelect }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const characterImages = {
    Male: ["1.png", "2.png", "3.png", "4.png", "5.png"],
    Female: ["1.png", "2.png", "3.png", "4.png", "5.png"],
  };

  const images = characterImages[gender];

  useEffect(() => {
    const preloadImages = () => {
      const promises = images.map((imageName) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = `/${gender}/${imageName}`;
          img.onload = resolve;
          img.onerror = resolve; // resolve even on error
        });
      });

      Promise.all(promises).then(() => {
        setTimeout(() => {
          setIsReady(true);
        }, 1000); // 2-second delay after images are preloaded
      });
    };

    preloadImages();
  }, [gender]);

  const handleSelect = (imageName) => {
    setSelectedImage(imageName);
    if (onSelect) onSelect(imageName);
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center mt-[180px] gap-[50px] flex-wrap">
        <span class="loader"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-[60px] gap-[50px] flex-wrap">
      {images.map((imageName, index) => (
        <div className="flex flex-col items-center cursor-pointer" key={index}>
          <img
            src={`/${gender}/${imageName}`}
            onClick={() => handleSelect(imageName)}
            className="w-[305px] h-[305px] rounded-[50%] hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-[#fff] "
            alt={imageName}
          />
          {/* <p className="text-white mt-10 text-[35px] relative group-hover:text-[#ccc]">
            {imageName.split(".")[0]}
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </p> */}
        </div>
      ))}
    </div>
  );
};

export default CharacterCard;
