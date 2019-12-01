import shuffle from "lodash.shuffle"
import { useState, useEffect, useCallback } from "react"
import { MyTracksGetter, PlaylistTracksGetter, StaticPlaylist } from "./Playlist"
import { formatError } from "./_common/formatError"
import { playlist_simple, saved_track } from "./_oai/api-types"
import {
  postUserPlaylists,
  postUserPlaylistTracks,
  putUserPlaylistTracks
} from "./_oai/modules/Users"
import { requester } from "./_common/requester"

export function Confirm({
  playlist,
  onCancel,
  onConfirm
}: {
  playlist: playlist_simple
  onCancel: () => void
  onConfirm: (playlist: playlist_simple) => void
}) {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(null as null | { current?; total?; message? })
  const [subsetSize, setSubsetSize] = useState(100)
  const [toCreate, setToCreate] = useState(null as null | { tracks: saved_track[] })
  const [fullList, setFullList] = useState([] as saved_track[])
  const [playlistName, setPlaylistName] = useState(playlist.name + " subset")

  useEffect(() => {
    Promise.resolve()
      .then(async () => {
        if (!playlist) return
        setIsLoading({ current: 0, total: 0 })
        const paginator =
          playlist.id === "liked_songs"
            ? new MyTracksGetter()
            : new PlaylistTracksGetter(playlist.id!)
        // get full playlist
        let data = await paginator.getPage()
        while (paginator.hasMore()) {
          data = await paginator.getMore()
          setIsLoading({ current: data.length, total: paginator.getTotal() })
        }
        setFullList(data)
        data = shuffle(data).slice(0, subsetSize)
        setToCreate({ tracks: data })
        setIsLoading(null)
      })
      .catch(err => {
        setIsLoading(null)
        setError(formatError(err))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reshuffle = useCallback(() => {
    if (!subsetSize) return
    const shuffled = shuffle(fullList).slice(0, subsetSize)
    setToCreate({ tracks: shuffled })
  }, [fullList, subsetSize])

  const finish = useCallback(() => {
    Promise.resolve()
      .then(async () => {
        setIsLoading({ message: "Creating..." })
        const userId = await requester.getUserId()
        const created = await postUserPlaylists({
          user_id: userId,
          body: {
            name: playlistName
          }
        })
        const tracksChunked = chunkify(toCreate?.tracks || [])
        for (let x = 0; x < tracksChunked.length; x++) {
          const chunk = tracksChunked[x]
          await putUserPlaylistTracks({
            user_id: userId,
            playlist_id: created.id!,
            body: {
              uris: chunk.map(track => track.track?.uri!) || []
            }
          })
        }
        setIsLoading({ message: "Success!" })
        setTimeout(() => {
          onConfirm(created)
        }, 2000)
      })
      .catch(err => {
        setIsLoading(null)
        setError(formatError(err))
      })
  }, [onConfirm, playlistName, toCreate])

  return (
    <div>
      <h1>Generated playlist</h1>
      {error && (
        <section>
          <h1>Error</h1>
          <p>{error}</p>
        </section>
      )}
      {isLoading && (
        <section>
          {isLoading.message && <p>{isLoading.message}</p>}
          {isLoading.current && (
            <p>
              Loading... {isLoading.current} of {isLoading.total}
            </p>
          )}
        </section>
      )}

      <div>
        <button onClick={onCancel}>Back</button>
      </div>
      <div>
        <label htmlFor="subsetSize">
          Subset size:
          <input
            type="text"
            value={subsetSize}
            onChange={ev => setSubsetSize(Number(ev.target.value) || ("" as any))}
          />
        </label>
      </div>
      <div>
        <label htmlFor="newPlaylistName">
          New playlist name:
          <input
            type="text"
            value={playlistName}
            onChange={ev => setPlaylistName(String(ev.target.value))}
          ></input>
        </label>
      </div>

      <div>
        <button onClick={finish}>Save playlist</button>
      </div>

      {toCreate && (
        <section>
          <div>
            <button onClick={reshuffle}>Reshuffle</button>
          </div>
          <StaticPlaylist tracks={toCreate.tracks} title="" />
        </section>
      )}
    </div>
  )
}

//ty wes bos
function chunkify<T>(array: T[], chunkSize = 100) {
  const chunks = Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, idx) => {
    const start = chunkSize * idx
    return array.slice(start, start + chunkSize)
  })
  return chunks
}
