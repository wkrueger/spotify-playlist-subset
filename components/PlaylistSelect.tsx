import { playlist, playlist_simple } from "./_oai/api-types"
import { useState, useRef, useEffect, useCallback } from "react"
import { Paginator } from "./_common/Paginator"
import { getMePlaylists } from "./_common/otherRoutes"
import { formatError } from "./_common/formatError"

class MyPlaylistsPage extends Paginator<playlist_simple> {
  async _getPage() {
    const resp = await getMePlaylists({})
    return {
      data: resp.items || [],
      next: resp.next
    }
  }
}

export interface PlaylistSelectProps {
  onSelect: (id: string) => any
}

export function PlaylistSelect(i: PlaylistSelectProps) {
  const [error, setError] = useState("")
  const [playlists, setPlaylists] = useState(null as null | playlist_simple[])
  const $paginator = useRef(new MyPlaylistsPage())

  useEffect(() => {
    $paginator.current
      .getPage()
      .then(resp => {
        setPlaylists(resp)
      })
      .catch(err => {
        setError(formatError(err))
      })
  }, [])

  const getMore = useCallback(() => {
    $paginator.current
      .getMore()
      .then(resp => {
        setPlaylists(resp)
      })
      .catch(err => setError(formatError(err)))
  }, [])

  const select = useCallback(
    (id: string) => ev => {
      i.onSelect(id)
    },
    [i]
  )

  return (
    <section>
      <h2>Playlist select</h2>
      {error && <p>{error}</p>}
      <div>
        <h3>My playlists</h3>

        <table>
          <tbody>
            <tr>
              <td>My liked songs</td>
              <td>
                <button type="button" onClick={select("liked_songs")}>
                  Select
                </button>
              </td>
            </tr>
            {playlists &&
              playlists.map(playlist => (
                <tr key={playlist.id}>
                  <td>{playlist.name}</td>
                  <td>
                    <button type="button" onClick={select(playlist.id!)}>
                      Select
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {$paginator.current.hasMore() && (
        <button type="button" onClick={getMore}>
          More...
        </button>
      )}
    </section>
  )
}
