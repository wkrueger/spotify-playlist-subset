import { Component, useRef, useEffect, useState } from "react"
import { formatError } from "./_common/formatError"
import { getPlaylist } from "./_common/otherRoutes"
import { Paginator } from "./_common/Paginator"
import { getMeTracks } from "./_oai/modules/Me"
import { saved_track, playlist_track } from "./_oai/api-types"

export function Playlist({ id, name }: { id: string; name: string }) {
  if (!id) return null
  if (id === "liked_songs") return <MyTracksPlaylist title={name} />
  return <PlaylistById id={id} name={name} />
}

export class MyTracksGetter extends Paginator<saved_track> {
  async _getPage() {
    const trackResp = await getMeTracks({})
    return {
      data: trackResp.items || [],
      next: trackResp.next,
      total: trackResp.total!
    }
  }
}

export class PlaylistTracksGetter extends Paginator<playlist_track> {
  constructor(public playlistId: string) {
    super()
  }

  async _getPage() {
    const playlist = await getPlaylist({ playlist_id: this.playlistId })
    return {
      data: playlist.tracks?.items || [],
      next: playlist.tracks?.next,
      total: playlist.tracks?.total!
    }
  }
}

class StaticGetter extends Paginator<saved_track> {
  constructor(public tracks: saved_track[]) {
    super()
  }

  async _getPage() {
    return { data: this.tracks, total: this.tracks.length }
  }
}

export function MyTracksPlaylist({ title }) {
  const $paginator = useRef(new MyTracksGetter())
  return <PlaylistInner tracksReader={$paginator.current} title={title} />
}

export function PlaylistById(i: { id: string; name: string }) {
  const $paginator = useRef(new PlaylistTracksGetter(i.id))
  return <PlaylistInner tracksReader={$paginator.current} title={i.name} />
}

export function StaticPlaylist({ tracks, title }: { tracks: saved_track[]; title }) {
  // gambi feia
  const [$paginator, setPaginator] = useState(new StaticGetter(tracks) as any)
  useEffect(() => {
    setPaginator(null)
    setTimeout(() => {
      setPaginator(new StaticGetter(tracks))
    }, 100)
  }, [tracks])
  if (!$paginator) return null
  return <PlaylistInner tracksReader={$paginator} title={title} />
}

interface PlaylistInnerProps {
  tracksReader: Paginator<saved_track>
  title: string
}

export class PlaylistInner extends Component<PlaylistInnerProps, PlaylistInner["state"]> {
  state = {
    tracks: null as null | saved_track[],
    loading: false,
    error: ""
  }

  async componentDidMount() {
    try {
      const reader = this.props.tracksReader
      const tracks = await reader.getPage()
      this.setState({ tracks })
    } catch (err) {
      this.setState({ error: formatError(err) })
    }
  }

  readMore = async () => {
    try {
      this.setState({ loading: true })
      const reader = this.props.tracksReader
      const tracks = await reader.getMore()
      this.setState({ tracks, loading: false })
    } catch (err) {
      this.setState({ error: formatError(err), loading: false })
    }
  }

  render() {
    const { tracks, loading, error } = this.state
    const { tracksReader, title } = this.props
    if (!tracks) return null
    return (
      <>
        <h1>{title}</h1>
        {error && <p>{error}</p>}
        <p>{tracksReader.getTotal()} tracks.</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map((line, idx) => (
              <tr key={line.track?.id + "-" + idx}>
                <td>{line.track?.name}</td>
                <td>{line.track?.artists?.map(x => x.name).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Loading...</p>}
        {tracksReader.hasMore() && (
          <button type="button" onClick={this.readMore}>
            More...
          </button>
        )}
      </>
    )
  }
}
