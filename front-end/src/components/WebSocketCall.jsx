import React, { useState, useEffect, useRef } from 'react';
import Player from "./Player";

export default function WebSocketCall({ socket }) {
  const backgroundImageUrl = 'http://127.0.0.1:5001/board';
  const [players, setPlayers] = useState([]);

  const handleMapClick = (event) => {
    const rect = event.target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    // Calculate the new position based on the grid
    const gridSize = { x: 10, y: 6 };
    const cellSize = { width: rect.width / gridSize.x, height: rect.height / gridSize.y };
    const newPosition = {
        x: Math.floor(mouseX / cellSize.width),
        y: Math.floor(mouseY / cellSize.height),
    };

    // Snap to the nearest grid cell
    newPosition.x = newPosition.x * cellSize.width + cellSize.width / 2 - 20 / 2;
    newPosition.y = newPosition.y * cellSize.height + cellSize.height / 2 - 30 / 2;

    socket.emit('move_player', { x: newPosition.x, y: newPosition.y });

  };

  useEffect(() => {
    socket.on("playerAdded", (playerData) => {
      setPlayers(playerData.data);
    });
  }, [socket]);

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        width: '50vw',
        height: '30vw',
        position: 'relative',
      }}
      onClick={handleMapClick}
    >
      {players.map((player) => (
        <Player
          key={player.id}
          x={player.location[0]}
          y={player.location[1]}
          imageUrl={player.imageURL}
        />
      ))}
    </div>
  );
}
