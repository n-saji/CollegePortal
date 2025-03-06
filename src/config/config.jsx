const protocol = window.location.protocol.includes('https') ? 'wss' : 'ws'

export const API_URL = "https://dolphin-app-2zya2.ondigitalocean.app";
export const SOCKET_URL = protocol + "://dolphin-app-2zya2.ondigitalocean.app/ws";

// export const API_URL = "http://localhost:5050";
// export const SOCKET_URL = protocol + '://localhost:5050/ws';

// export const API_URL = "http://3.15.188.218:5050";
// export const SOCKET_URL = protocol + "://3.15.188.218:8080/ws";

export const BASE_URL = "";