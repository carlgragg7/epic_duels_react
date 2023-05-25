import React, { useState, useEffect, useRef } from 'react';
import Player from "./Player";
import Card from './Card';

export default function WebSocketCall({ socket }) {
  const backgroundImageUrl = 'http://127.0.0.1:5001/board';
  const [players, setPlayers] = useState([]);

  const [viewHand, setViewHand] = useState(false);
  const [viewDiscard, setViewDiscard] = useState(false);
  const [viewDeck, setViewDeck] = useState(false);

  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [discard, setDiscard] = useState([]);
  const [played_cards, setPlayedCards] = useState([]);

  const [selected_card, setSelectedCardId] = useState(null);
  const [card_is_selected, setCardIsSelected] = useState(false);

  const [randomNumber, setRandomNumber] = useState(null);

  const generateNumber = () => {
    const newNumber = Math.floor(Math.random() * 6) + 1;
    if (newNumber === 1) {
      setRandomNumber("Three");
    } else if (newNumber === 2) {
      setRandomNumber("Four");
    } else if (newNumber === 3) {
      setRandomNumber("Five");
    } else if (newNumber === 4) {
      setRandomNumber("2 All");
    } else if (newNumber === 5) {
      setRandomNumber("3 All");
    } else if (newNumber === 6) {
      setRandomNumber("4 All");
    }
  };

  const handleViewHandClick = () => {
    socket.emit("get_hand");
    setViewHand(true);
    setViewDiscard(false);
    setViewDeck(false);
  };

  const handleViewDiscardClick = () => {
    socket.emit("get_discard_pile");
    setViewHand(false);
    setViewDiscard(true);
    setViewDeck(false);
  };

  const handleViewDeckClick = () => {
    socket.emit("get_deck");
    setViewHand(false);
    setViewDiscard(false);
    setViewDeck(true);
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
    console.log("Card ID: ", cardId);
    setCardIsSelected(true);
  };

  const handleCardPlay = () => {
    if (!card_is_selected) {
      return;
    }
    socket.emit("play_card", { selected_card });
    setCardIsSelected(false);
    setSelectedCardId();
  };

  const handleDiscardCard = () => {
    if (!card_is_selected) {
      return;
    }
    socket.emit("discard_card", { selected_card });
    setCardIsSelected(false);
    setSelectedCardId();
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

  const handleReshuffle = () => {
    socket.emit("shuffle_discard_to_main_deck");
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

    socket.on("get_discard_pile", (deckData) => {
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
      <button onClick={generateNumber}>Generate Random Number</button>
      {randomNumber && <p>The random number is: {randomNumber}</p>}
      <button onClick={onDrawCard}>Draw Card</button>
      {/* change view hand to hide hand if view hand is clicked */}
      <button onClick={handleViewHandClick}>View Hand</button>
      <button onClick={handleViewDiscardClick}>View Discard</button>
      <button onClick={handleViewDeckClick}>View Deck</button>
      <button onClick={handleReshuffle}>Shuffle Discard to Deck</button>
      {card_is_selected ? (
        <div>
          <button onClick={handleCardPlay}>Play Card</button>
          <button onClick={handleDiscardCard}>Discard Card</button>
        </div>
      ) : (
        <div>
          <button disabled>Play Card</button>
          <button disabled>Discard Card</button>
        </div>
      )}
      {/* When Cards are played, they will be displayed here */}
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {played_cards.map((card) => (
          <Card
            key={card.id}
            id={card.id}
            name={card.name}
            text={card.text}
            attack={card.attack}
            defense={card.defense}
            onCardClick={handleCardClick}
          />
        ))}
      </div>

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
            width={player.width}
            height={player.height}
          />
        ))}
      </div>

      {/* On view hand button click, show hand */}
      {viewHand && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {hand.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              text={card.text}
              attack={card.attack}
              defense={card.defense}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
      {/* On view deck button click, show deck */}
      {viewDeck && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {deck.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              name={card.name}
              text={card.text}
              attack={card.attack}
              defense={card.defense}
              onCardClick={handleCardClick}
            />
          ))}
        </div>
      )}
      {/* On view discard button click, show discard  */}
      {viewDiscard && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          {discard.map((card) => (
            <Card
            key={card.id}
            id={card.id}
            name={card.name}
            text={card.text}
            attack={card.attack}
            defense={card.defense}
            onCardClick={handleCardClick}
          />
          ))}
        </div>
      )}
    </div>
  );
}
