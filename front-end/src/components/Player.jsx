import React from "react";

export default function Player ({ x, y, imageUrl, width, height }) {
  return (
    <div
      style={{
        position: "absolute",
        top: y + "px",
        left: x + "px",
        backgroundImage: `url(${imageUrl})`,
        width: width,
        height: height,
        backgroundSize: "cover",
      }}
    ></div>
  );
};
