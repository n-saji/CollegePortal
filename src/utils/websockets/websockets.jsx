import React, { useState, useEffect, useRef } from "react";
import "./websockets.css";
import { SOCKET_URL, API_URL } from "../../config/config";
import { getCookie } from "../cookies";
import axios from "axios";

function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Convert to milliseconds
  const options = {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const WebSocketComponent = (props) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState(new Map());
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
      setMessages(new Map());
    }
  }, [bell, newMessage]);

  const connectWebSocket = () => {
    const socket = new WebSocket(SOCKET_URL + "/" + getCookie("account_id"));

    if (isConnected) {
      console.log("WebSocket already connected");
      return;
    }

    socket.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setRetries(0); // Reset retries on successful connection
    };

    socket.onmessage = (event) => {
      const jsonmsg = JSON.parse(event.data);
      const msgId = jsonmsg.ID;
      setMessages((prevMessages) => {
        console.log(prevMessages);
        if (prevMessages.has(msgId)) {
          console.log("Duplicate message ignored:", msgId);
          return prevMessages;
        }
        setNewMessage(true);
        const newMessages = new Map(prevMessages);
        newMessages.set(msgId, jsonmsg);
        return newMessages
      });
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
    if (retries < 5 && !isConnected) {
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
        data-count={newMessage ? messages.size : ""}
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
            {messages.size > 0 ? (
              [...messages.values()].map((msg) => (
                <div className="msg-container">
                  <li key={msg.ID}>
                    <h3 className="msg-title">{msg.Title}</h3>
                    <p className="msg-messages">{msg.Messages}</p>
                    <p className="msg-author">Added By: {msg.Author}</p>
                    <p className="msg-created-at">
                      At: {formatUnixTimestamp(msg.CreatedAt)}
                    </p>
                  </li>
                </div>
              ))
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

// AccountID      // :      // "782126da-db7b-4269-8dca-46afeaa73795"
// Author       // :       // "Nikhil Admin"
// CreatedAt       // :       // 1742318232
// ID       // :       // "d88171eb-3e0a-45cc-9cfc-d8a8c9877090"
// IsRead       // :       // false
// Messages       // :       // "Testing 10.31"
// Title       // :       // "New Course"
