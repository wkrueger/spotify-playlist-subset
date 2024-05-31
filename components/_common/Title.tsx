import Link from "next/link"
import { ReactNode, useCallback } from "react"
import { requester } from "./requester"

export const Title: React.FC<{ children: ReactNode }> = props => {
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
        <Link href="/">Playlist subset</Link>
        <Link href="/podcasts">Podcasts</Link>
      </nav>
      {props.children}
    </div>
  )
}
