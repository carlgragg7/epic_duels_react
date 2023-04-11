import React, { useState, useEffect, useRef } from 'react';
import Player from "./Player";
import Card from './Card';

export default function WebSocketCall({ socket }) {
  const backgroundImageUrl = 'http://127.0.0.1:5001/board';
  const [players, setPlayers] = useState([]);

  const [viewHand, setViewHand] = useState(false);

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [played_cards, setPlayedCards] = useState([]);

  const handleViewHandClick = () => {
    socket.emit("get_hand");
    setViewHand(!viewHand);
  };

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

  const onDrawCard = () => {
    socket.emit("draw_card");
  };

  useEffect(() => {
    socket.on("playerAdded", (playerData) => {
      setPlayers(playerData.data);
    });

    socket.on("get_deck", (deckData) => {
      setDeck(deckData.data);
    });

    socket.on("get_hand", (deckData) => {
      setHand(deckData.data);
    });

    socket.on("get_discard", (deckData) => {
      setDiscard(deckData.data);
    });

    socket.on("get_played_cards", (deckData) => {
      setPlayedCards(deckData.data);
    });

    socket.on("draw_card", (deckData) => {
      setHand(deckData.data);
    });

  }, [socket]);

  return (
    <div>
      <button onClick={onDrawCard}>Draw Card</button>
      <button onClick={handleViewHandClick}>View Hand</button>
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

      {/* On view hand button click, show hand */}
      {viewHand && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {hand.map((card) => (
            <Card
              key={card.id}
              name={card.name}
              text={card.text}
              attack={card.attack}
              defense={card.defense}
            />
          ))}
        </div>
      )}
    </div>
  );
}
