import axios from "axios";
import { BACKEND_URL } from "@env";

// Configuration
const API_KEY = "AIzaSyA-1cGI3mDtYVbOXg5J7sM4lrIFR8FES-4";
const emulatorBaseURL = "http://10.0.2.2:3000/users";
const backendURL = BACKEND_URL + "/users";

//const firebaseURLSignUp = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
//const firebaseURLSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

async function performAPIRequest(endpoint, data) {
  console.log(BACKEND_URL);
  try {
    const response = await axios.post(`${backendURL}/${endpoint}`, data);
    const token = response.data.accessToken;
    return token;
  } catch (error) {
    console.log("Login failed: " + error);
    throw error;
  }
}

export async function signUpUser(email, password, fullName) {
  try {
    return performAPIRequest("register", {
      email: email,
      password: password,
      fullName: fullName,
    });
  } catch (error) {
    throw error;
  }
}

export async function signInUser(email, password) {
  try {
    return performAPIRequest("login", { email: email, password: password });
  } catch (error) {
    throw error;
  }
}
