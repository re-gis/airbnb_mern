import React, { useEffect, useState } from "react";
import axios from "axios";

const PlaceImg = ({ place, index = 0, className = null }) => {
  if (!place.photos?.length) {
    return <>Nice</>;
  }

  if (!className) {
    className = "object-cover";
  }
  return (
    <>
      <img
        className={className}
        src={"http://localhost:4000/uploads/" + place.photos[index]}
      />
    </>
  );
};

export default PlaceImg;