import { useCallback, useState } from "react"
import { requester } from "./_common/requester"
import { saved_track } from "./_oai/api-types"
import { PlaylistSelect } from "./PlaylistSelect"
import { Playlist } from "./Playlist"

export function App() {
  const [error, setError] = useState("")
  const [playlistId, setPlaylistId] = useState("")

  const logout = useCallback(() => {
    requester.clearToken()
    window.location.reload()
  }, [])

  return (
    <div>
      <nav>
        <button onClick={logout}>Log out</button>
      </nav>
      {error && (
        <section>
          <h1>Error</h1>
          <p>{error}</p>
        </section>
      )}
      {!playlistId && <PlaylistSelect onSelect={id => setPlaylistId(id)} />}
      {playlistId && (
        <>
          <section>
            <button onClick={() => setPlaylistId("")}>Select another playlist</button>
          </section>
          <Playlist id={playlistId} />
        </>
      )}
    </div>
  )
}
