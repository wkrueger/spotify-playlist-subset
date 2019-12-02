import { v4 } from "uuid"
import { CLIENT_ID, SPOFY_ACCOUNTS_URL, SPOFY_REDIRECT_URL } from "../components/_common/requester"
import Link from "next/link"
import { useEffect, useState } from "react"

const allScopes = {
  "user-top-read": "user-top-read",
  "user-read-recently-played": "user-read-recently-played",
  "user-library-modify": "user-library-modify",
  "user-library-read": "user-library-read",
  "playlist-read-private": "playlist-read-private",
  "playlist-modify-public": "playlist-modify-public",
  "playlist-modify-private": "playlist-modify-private"
}

export function NonAuthenticated() {
  const [msg, setMsg] = useState("User is not authenticated.")

  async function authenticate() {
    const state = v4()
    localStorage.setItem("spofy_auth_state", state)
    const data = {
      client_id: CLIENT_ID,
      response_type: "token",
      redirect_uri: SPOFY_REDIRECT_URL,
      state,
      scope: [
        allScopes["user-top-read"],
        allScopes["user-read-recently-played"],
        allScopes["user-library-read"],
        allScopes["playlist-read-private"],
        allScopes["playlist-modify-private"],
        allScopes["playlist-modify-public"]
      ].join(" ")
    }
    const url = new URL(SPOFY_ACCOUNTS_URL + "/authorize")
    Object.entries(data).forEach(([k, v]) => {
      url.searchParams.append(k, v || "")
    })
    window.location.href = url.toString()
  }

  useEffect(() => {
    if (window.location.hash === "#auth-error") {
      setMsg(
        "Whatever you tried to access, your permissions were not enough. Try one of the options below."
      )
    }
  }, [])

  return (
    <>
      <h1>{msg}</h1>

      <button onClick={authenticate}>Concede us your soul</button>
      <br />
      <Link href="/better-token">
        <button>Concede us something more (required for podcasts)</button>
      </Link>
    </>
  )
}
