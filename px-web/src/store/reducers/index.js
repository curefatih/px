import { combineReducers } from "redux";
import playlist from "./playlist";
import socket from "./connection";

export default combineReducers({ playlist, socket });
