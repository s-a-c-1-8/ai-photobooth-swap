import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CharacterCard from "./CharacterCard";

const CharacterSelectionScreen = () => {
  const location = useLocation();
  const { gender } = location.state || {};

  const navigate = useNavigate();

  function goToCamera(imgName) {
    navigate("/camera", {
      state: { character: imgName, gender: gender },
    });
  }
  return (
    <>
      <h2 className="text-center font-bold text-[80px] text-[#fff] mt-[225px]">
        Pick Your Avatar - {gender}
      </h2>
      <CharacterCard
        gender={gender}
        onSelect={(imgName) => goToCamera(imgName)}
      />
    </>
  );
};

export default CharacterSelectionScreen;
