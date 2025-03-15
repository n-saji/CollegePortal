import React, { useState, useEffect, useRef } from "react";
import "./websockets.css";
import { SOCKET_URL, API_URL } from "../../config/config";
import { getCookie } from "../cookies";
import axios from "axios";

export const WebSocketComponent = (props) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [retries, setRetries] = useState(0);
  const [bell, setBell] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const bellRef = useRef(false);

  const handleClickOutside = (event) => {
    if (bellRef.current && !bellRef.current.contains(event.target)) {
      setBell(false);
    }
  };

  useEffect(() => {
    if (bell === true) {
      setNewMessage(false);
      props.setShowProfileDropdown(false);
    }

    if (bell) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [bell]);

  useEffect(() => {
    if (newMessage === false && bell === false) {
      setMessages([]);
    }
  }, [bell, newMessage]);

  const connectWebSocket = () => {
    const socket = new WebSocket(SOCKET_URL + "/" + getCookie("account_id"));

    if (isConnected) {
      return;
    }

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setRetries(0); // Reset retries on successful connection
    };

    socket.onmessage = (event) => {
      setMessages((prevMessages) => [...prevMessages, event.data]);
      setNewMessage(true);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      return;
    };

    socket.onclose = (event) => {
      console.log("WebSocket closed:", event);
      setIsConnected(false);
      attemptReconnect();
    };

    setSocket(socket);
  };

  const attemptReconnect = () => {
    if (retries < 5) {
      console.log(retries);
      const backoffTime = 50000;
      setRetries((prevRetries) => prevRetries + 1);

      console.log(
        `Attempting to reconnect in ${backoffTime / 1000} seconds...`
      );

      setTimeout(() => {
        connectWebSocket();
      }, backoffTime);
    } else {
      console.log("Max retries reached. Unable to reconnect.");
    }
  };

  useEffect(() => {
    if (!isConnected) {
      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isConnected]);

  const sendReadMSG = () => {
    if (!bell) {
      return;
    }
    axios
      .get(API_URL + "/read-message/" + getCookie("account_id"), {
        headers: {
          Token: getCookie("token"),
        },
      })
      .then(() => {
        console.log("Read message sent");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="notification">
      <div
        className="bell"
        data-count={newMessage ? messages.length : ""}
        ref={bellRef}
      >
        <img
          src="https://img.icons8.com/carbon-copy/100/bell--v1.png"
          alt="bell"
          onClick={() => {
            setBell(!bell);
            sendReadMSG();
          }}
        />
      </div>
      {bell && (
        <div className="messages">
          <ul>
            {messages.length ? (
              messages.map((msg, index) => <li key={index}>{msg}</li>)
            ) : (
              <li>No new messages</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WebSocketComponent;
