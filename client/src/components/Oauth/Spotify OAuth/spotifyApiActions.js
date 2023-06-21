// Because this is a literal single page application
// we detect a callback from Spotify by checking for the hash fragment
import { redirectToAuthCodeFlow, getAccessToken } from "./authCodeWithPkce"

// clientId should not be hard-coded on client side, move to server side later on
const clientId = "a1205770b15144e0a77fff7882931779"
const params = new URLSearchParams(window.location.search)
const code = params.get("code")

// export const spotifyOauthPkce = async () => {
//   if (!code) {
//     redirectToAuthCodeFlow(clientId)
//   } else {
//     const accessToken = await getAccessToken(clientId, code)
//     const profile = await fetchProfile(accessToken)
//     // populateUI(profile);
//   }
// }

export async function fetchProfile(accessToken) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` }
  })

  return await result.json();
}

// function populateUI(profile) {
//   document.getElementById("displayName").innerText = profile.display_name
//   document.getElementById("avatar").setAttribute("src", profile.images[0].url)
//   document.getElementById("id").innerText = profile.id
//   document.getElementById("email").innerText = profile.email
//   document.getElementById("uri").innerText = profile.uri
//   document
//     .getElementById("uri")
//     .setAttribute("href", profile.external_urls.spotify)
//   document.getElementById("url").innerText = profile.href
//   document.getElementById("url").setAttribute("href", profile.href)
//   document.getElementById("imgUrl").innerText = profile.images[0].url
// }
