import axios from "axios";
import { BACKEND_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
// Configuration
const API_KEY = "AIzaSyA-1cGI3mDtYVbOXg5J7sM4lrIFR8FES-4";
const emulatorBaseURL = "http://10.0.2.2:3000/users";
const backendURL = BACKEND_URL + "/users";

//const firebaseURLSignUp = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
//const firebaseURLSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

async function performAPIRequest(endpoint, data) {
  try {
    const response = await axios.post(`${backendURL}/${endpoint}`, data);
    const token = response.data.accessToken;
    if (data.fullName) {
      const { fullName, email } = data;
      try {
        await AsyncStorage.setItem("fullName", fullName);
        await AsyncStorage.setItem("email", email);
      } catch (storageError) {
        console.error("Error saving data to AsyncStorage:", storageError);
      }
    }
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
