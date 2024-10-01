import axios from "axios";

// Configuration
const API_KEY = "AIzaSyA-1cGI3mDtYVbOXg5J7sM4lrIFR8FES-4";
const emulatorBaseURL = "http://10.0.2.2:3000/users";
const backendURL = "http://128.131.195.95:3000/users"; //tuwien tunet
//const firebaseURLSignUp = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
const firebaseURLSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

async function performAPIRequest(endpoint, data) {
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
