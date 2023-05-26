import React from "react";

export default function Card ({ id, name, text, attack, defense, onCardClick }) {
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
      onClick={() => onCardClick(id)}
    >
        {/* Header 1 with attack data with red text */}
        <p style={{color: "red"}}>Attack: {attack}</p>
        <p style={{color: "blue"}}>Defense: {defense}</p>
        <p>Name: {name}</p>
        <p>Text: {text}</p>
    </div>
  );
};
