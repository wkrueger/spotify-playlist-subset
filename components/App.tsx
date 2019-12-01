import { useCallback, useState } from "react"
import { Playlist, StaticPlaylist } from "./Playlist"
import { PlaylistSelect } from "./PlaylistSelect"
import { requester } from "./_common/requester"
import { playlist_simple, saved_track } from "./_oai/api-types"
import { Confirm } from "./Confirm"

export function App() {
  const [message, setMessage] = useState("")
  const [playlist, setPlaylist] = useState(null as playlist_simple | null)
  const [confirming, setConfirming] = useState(false)

  const onConfirm = useCallback((playlist: playlist_simple) => {
    setPlaylist(null)
    setConfirming(false)
    setMessage("Playlist sucessfully created.")
    setTimeout(() => {
      setMessage("")
    }, 10000)
  }, [])

  const logout = useCallback(() => {
    requester.clearToken()
    window.location.reload()
  }, [])

  return (
    <div>
      <nav>
        <button onClick={logout}>Log out</button>
      </nav>
      {message && (
        <section>
          <p style={{ fontWeight: "bold" }}>{message}</p>
        </section>
      )}
      {confirming && playlist && (
        <>
          <Confirm
            playlist={playlist}
            onCancel={() => setConfirming(false)}
            onConfirm={onConfirm}
          />
          <hr />
        </>
      )}
      {!playlist && <PlaylistSelect onSelect={id => setPlaylist(id)} />}
      {playlist && (
        <>
          <section>
            <button onClick={() => setPlaylist(null)}>Select another playlist</button>
            <button onClick={() => setConfirming(true)}>Generate subset</button>
          </section>
          <Playlist id={playlist.id!} name={playlist.name!} />
        </>
      )}
    </div>
  )
}
