import React from "react";
import { useNavigate } from "react-router-dom";
import male from "../assets/male.png";
import female from "../assets/female.png";

const GenderSelectionScreen = () => {
  const navigate = useNavigate();

  function selectCharacter(selectedGender) {
    navigate("/character-selection", {
      state: { gender: selectedGender },
    });
  }

  return (
    <>
      <h2 className="text-center font-bold text-[80px] text-[#fff] mt-[225px]">
        Choose Your Avatar Style
      </h2>

      <div className="flex justify-center items-center mt-[60px] gap-[50px]">
        <div className="flex flex-col items-center cursor-pointer group">
          <img
            src={male}
            onClick={() => selectCharacter("Male")}
            className="hover:scale-105 transition-all duration-300 group-hover:scale-105"
          />
          <p className="text-white mt-10 text-[35px] relative group-hover:text-[#ccc]">
            MALE
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </p>
        </div>
        <div className="flex flex-col items-center cursor-pointer group">
          <img
            src={female}
            onClick={() => selectCharacter("Female")}
            className="hover:scale-105 transition-all duration-300 group-hover:scale-105"
          />
          <p className="text-white mt-10 text-[35px] relative group-hover:text-[#ccc]">
            FEMALE
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
          </p>
        </div>
      </div>
    </>
  );
};

export default GenderSelectionScreen;
