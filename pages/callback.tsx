import { useEffect, useState } from "react"
import { requester } from "../components/_common/requester"
import Router from "next/router"

function Main() {
  const [error, setError] = useState("")

  useEffect(() => {
    async function run() {
      try {
        const hash = window.location.hash
        const parsed: { access_token; token_type; expires_in; state } = hash
          .substr(1)
          .split("&")
          .reduce((out, line) => {
            const lineSplit = line.split("=").map(decodeURIComponent)
            return {
              ...out,
              [lineSplit[0]]: lineSplit[1]
            }
          }, {} as any)
        console.log("parsed", parsed)

        if (!parsed.access_token) {
          throw Error("Authorization denied.")
        }
        const expected_state = localStorage.getItem("spofy_auth_state")
        if (expected_state !== parsed.state) {
          throw Error("Unexpected auth state.")
        }
        localStorage.removeItem("spofy_state")
        requester.authenticate(parsed)
        Router.push("/")
      } catch (err) {
        setError(String(err))
      }
    }
    run()
  }, [])

  return (
    <>
      {error && (
        <div>
          <h1>
            Error <p>{error}</p>
          </h1>
        </div>
      )}
    </>
  )
}

export default Main
