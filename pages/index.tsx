import { useEffect, useState } from "react"
import { App } from "../components/App"
import { NonAuthenticated } from "../components/NonAuthenticated"
import { requester } from "../components/_common/requester"
import Head from "next/head"
import { Title } from "../components/_common/Title"

export default function Main() {
  const [authOk, setAuthOk] = useState(null as null | boolean)

  useEffect(() => {
    const hasToken = requester.getSavedToken()
    setAuthOk(Boolean(hasToken.access_token))
  }, [])

  if (authOk === null) return null

  return (
    <Title>
      <Head>
        <title>Spotify playlist subset</title>
      </Head>
      {!authOk && <NonAuthenticated />}
      {authOk && <App />}
    </Title>
  )
}
