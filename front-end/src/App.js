import "./App.css";
import HttpCall from "./components/HttpCall";
import WebSocketCall from "./components/WebSocketCall";
import { io } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [socketInstance, setSocketInstance] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonStatus, setButtonStatus] = useState(false);
  const [character, setCharacter] = useState('');

  const handleChange = (event) => {
      setCharacter(event.target.value);
  };

  const handleClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  useEffect(() => {
    if (buttonStatus === true) {
      const socket = io("localhost:5001/", {
        transports: ["websocket"],
        cors: {
          origin: "http://localhost:3000",
        },
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        socket.emit("create_character", { character })
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log(data);
      });

      return function cleanup() {
        socket.disconnect();
      };
    }
  }, [buttonStatus]);

  return (
    <div className="App">
      <h1>Star Wars Epic Duels</h1>
      {!buttonStatus ? (
        <form>
        <select value={character} onChange={handleChange}>
            <option value="">--Please choose a character--</option>
            <option value="luke">Luke Skywalker</option>
            <option value="vader">Darth Vader</option>
            <option value="obi">Obi-Wan Kenobi</option>
            <option value="maul">Darth Maul</option>
        </select>
        <button onClick={handleClick} disabled={!character}>Connect to Server</button>
    </form>
      ) : (
        <>
          <button onClick={handleClick}>Disconnect</button>
          <div className="line">
          {!loading && (
              <WebSocketCall socket={socketInstance} />
          )}
        </div>
        </>
      )}
    </div>
  );
}

export default App;
