const API_KEY = "AIzaSyA-1cGI3mDtYVbOXg5J7sM4lrIFR8FES-4";

async function authenticate(mode, email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;
  // const response = await fetch(url, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     email: email,
  //     password: password,
  //     returnSecureToken: true,
  //   }),
  //   headers: {
  //     "Content-type": "application/json",
  //   },
  // });
  //   const result = await response.json();
  //   const token = result.idToken;
  //   return token;
}

export async function signUpUser(email, password) {
  return authenticate("signUp", email, password);
}

export async function signInUser(email, password) {
  console.log(email + " passs:" + password);
  return authenticate("signInWithPassword", email, password);
}
