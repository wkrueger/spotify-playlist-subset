import Link from "next/link"
import { useCallback } from "react"
import { requester } from "./requester"

export const Title: React.SFC = props => {
  const logout = useCallback(() => {
    requester.clearToken()
    window.location.reload()
  }, [])

  return (
    <div>
      <style jsx global>{`
        nav a {
          padding: 15px;
        }
      `}</style>
      <nav>
        <button onClick={logout}>Log out</button>
        <Link href="/">
          <a>Playlist subset</a>
        </Link>
        <Link href="/podcasts">
          <a>Podcasts</a>
        </Link>
      </nav>
      {props.children}
    </div>
  )
}
