import io from 'socket.io-client';
import AuthService from '../Auth';
var socket = io.connect('http://localhost:5000', {
  query: {
    token: 'cde'
  }
});

export { socket };