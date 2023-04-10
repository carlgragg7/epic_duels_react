import React from "react";

export default function Player ({ x, y, imageUrl }) {
  return (
    <div
      style={{
        position: "absolute",
        top: y + "px",
        left: x + "px",
        backgroundImage: `url(${imageUrl})`,
        width: "20px",
        height: "30px",
        backgroundSize: "cover",
      }}
    ></div>
  );
};
