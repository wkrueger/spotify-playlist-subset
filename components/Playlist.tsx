import { Component, useRef } from "react"
import { formatError } from "./_common/formatError"
import { getPlaylist } from "./_common/otherRoutes"
import { Paginator } from "./_common/Paginator"
import { playlist_track, saved_track } from "./_oai/api-types"
import { getMeTracks } from "./_oai/modules/Me"

export function Playlist({ id }: { id: string }) {
  if (!id) return null
  if (id === "liked_songs") return <MyTracksPlaylist />
  return <PlaylistById id={id} />
}

export class MyTracksGetter extends Paginator<saved_track> {
  async _getPage() {
    const trackResp = await getMeTracks({})
    return {
      data: trackResp.items || [],
      next: trackResp.next
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
      next: playlist.tracks?.next
    }
  }
}

export function MyTracksPlaylist() {
  const $paginator = useRef(new MyTracksGetter())
  return <PlaylistInner tracksReader={$paginator.current} />
}

export function PlaylistById(i: { id: string }) {
  const $paginator = useRef(new PlaylistTracksGetter(i.id))
  return <PlaylistInner tracksReader={$paginator.current} />
}

interface PlaylistInnerProps {
  tracksReader: Paginator<saved_track>
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
    const { tracks, loading } = this.state
    const { tracksReader } = this.props
    if (!tracks) return null
    return (
      <>
        <h1>My tracks</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {tracks.map(line => (
              <tr key={line.track?.id}>
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
