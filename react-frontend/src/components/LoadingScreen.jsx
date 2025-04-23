import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center  mt-[60px]">
      <p className="text-center font-bold text-[80px] text-[#fff] mt-[225px] mb-[120px]">
        Sharing your avatar. <br /> You’re looking great!
      </p>
      <span class="loader"></span>
    </div>
  );
};

export default LoadingScreen;
