import React from "react";

export default function Card ({ name, text, attack, defense }) {
  return (
    <div
      style={{
        position: "flex",
        top: "10px",
        left: "10px",
        border: "1px solid black",
        width: "200px",
        height: "200px",

      }}
    >
        {/* Header 1 with attack data with red text */}
        <p style={{color: "red"}}>Attack: {attack}</p>
        <p style={{color: "blue"}}>Defense: {defense}</p>
        <p>Name: {name}</p>
        <p>Text: {text}</p>
    </div>
  );
};
