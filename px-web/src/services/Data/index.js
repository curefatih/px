import AuthService from "../Auth"

const API_URL = "http://localhost:5000"

const headers = {
  "Content-Type": "application/json"
}

export function CreateRoom(pass) {
  return fetch(API_URL + "/rooms/create",
    {
      method: "POST",
      headers,
      body: JSON.stringify(
        {
          password: pass
        }
      )
    })
    .then(res => res.json())
}

export function LoginRoom(roomID, password) {
  return fetch(API_URL + "/rooms/login", {
    method: "POST",
    headers,
    body: JSON.stringify(
      {
        roomID,
        password
      }
    )
  })
    .then(res => res.json())
}

export function CheckIsPasswordRequired(roomID) {
  return fetch(API_URL + "/rooms/" + roomID, {
    method: "GET",
    headers,
  })
    .then(res => res.json())
}

export async function CheckTokenIsValıd(roomID) {
  console.log("here");
  if (!AuthService.isTokenValid()) Promise.resolve(false);
  console.log("here");
  return fetch(API_URL + "/rooms/"+ roomID + "/checkMember", {
    "headers": {
      "authorization": "Bearer " + AuthService.getToken()
    }
  })
    .then(res => res.json())
    .then(res => {
      console.log("here");
      if (res.isMember) return true;
      return false;
    })
    .catch(error => {
      return false
    })
}