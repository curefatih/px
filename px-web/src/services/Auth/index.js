import Auth from "./Auth";

const AuthService = new Auth("http://localhost:5000", "/login")

export default AuthService;