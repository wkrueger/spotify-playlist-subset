import { useState, useRef, useEffect, useCallback } from "react"
import { Paginator } from "./_common/Paginator"
import { getMePlaylists, getPlaylist } from "./_common/undocumentedRoutes"
import { formatError } from "./_common/formatError"
import { playlist_simple } from "./_oai/api-types"

class MyPlaylistsPage extends Paginator<playlist_simple> {
  async _getPage() {
    const resp = await getMePlaylists({})
    return {
      data: resp.items || [],
      next: resp.next,
      total: resp.total!
    }
  }
}

export interface PlaylistSelectProps {
  onSelect: (playlist: playlist_simple) => any
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
    (playlist: playlist_simple) => ev => {
      i.onSelect(playlist)
    },
    [i]
  )
  const $otherPlaylist = useRef<any>()
  const selectOther = useCallback(() => {
    const value = $otherPlaylist.current.value
    let split = value.split('/').map(x => x.trim()).filter(Boolean)
    let id = split[split.length-1]
    getPlaylist({ playlist_id: id }).then( resp => {
      i.onSelect(resp)
    }).catch(err => setError(formatError(err)))
    console.log(value)
  }, [$otherPlaylist, i])


  return (
    <section>
      <h1>Playlist select</h1>
      {error && <p>{error}</p>}
      <div>
        <h2>My playlists</h2>

        <table>
          <tbody>
            <tr>
              <td>My liked songs</td>
              <td>
                <button
                  type="button"
                  onClick={select({ id: "liked_songs", name: "My liked songs" })}
                >
                  Select
                </button>
              </td>
            </tr>
            <tr>
              <td>
                Other (paste here): <input type="text" name="otherPlaylistLink" ref={$otherPlaylist}/>
              </td>
              <td>
                <button type="button" onClick={selectOther}>Select</button>
              </td>
            </tr>
            {playlists &&
              playlists.map(playlist => (
                <tr key={playlist.id}>
                  <td>{playlist.name}</td>
                  <td>
                    <button type="button" onClick={select(playlist)}>
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
