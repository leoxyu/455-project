export async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128)
  const challenge = await generateCodeChallenge(verifier)

  localStorage.setItem("verifier", verifier)

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("response_type", "code")
  params.append("redirect_uri", "http://localhost:3000/home")
  params.append("scope", "user-read-private user-read-email")
  params.append("code_challenge_method", "S256")
  params.append("code_challenge", challenge)

  const oAuthURL = `https://accounts.spotify.com/authorize?${params.toString()}`;

  window.addEventListener('message', (event) => {
    // Check if the message is from the OAuth popup window
    if (event.origin === 'http://localhost:3000') {
      // Close the popup window
      if (event.data === 'authentication_complete') {
        popup.close();
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    // Send a message to the parent window indicating authentication is complete
    window.opener.postMessage('authentication_complete', 'http://localhost:3000');
  });

  const popup = window.open(oAuthURL, "popup", "popup=true");

}

export async function getAccessToken({ clientId, code }) {
  const verifier = localStorage.getItem("verifier")

  const params = new URLSearchParams()
  params.append("client_id", clientId)
  params.append("grant_type", "authorization_code")
  params.append("code", code)
  params.append("redirect_uri", "http://localhost:3000/home")
  params.append("code_verifier", verifier)

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  })

  const { access_token } = await result.json()
  return access_token
}

function generateCodeVerifier(length) {
  let text = ""
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest("SHA-256", data)
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}
