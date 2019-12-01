import { useEffect, useState } from "react"
import { App } from "../components/App"
import { NonAuthenticated } from "../components/NonAuthenticated"
import { requester } from "../components/_common/requester"

export default function() {
  const [authOk, setAuthOk] = useState(null as null | boolean)

  useEffect(() => {
    const hasToken = requester.getSavedToken()
    setAuthOk(Boolean(hasToken.access_token))
  }, [])

  if (authOk === null) return null

  return (
    <div>
      {!authOk && <NonAuthenticated />}
      {authOk && <App />}
    </div>
  )
}
