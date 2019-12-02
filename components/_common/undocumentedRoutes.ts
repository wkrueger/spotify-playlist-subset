/**
 * o spotify não tem um openapi oficial, e aquele que achei não está completo
 */

import * as ApiCommon from "../_oai/api-common"
import { playlist, playlist_simple_page } from "../_oai/api-types"

interface GetPlaylistParams {
  playlist_id: string
}

export const getPlaylist = ApiCommon.requestMaker<GetPlaylistParams, playlist>({
  id: "getPlaylist",
  path: "/playlists/{playlist_id}",
  verb: "GET",
  parameters: [{ in: "path", name: "playlist_id", required: true }]
})

export const getMePlaylists = ApiCommon.requestMaker<{}, playlist_simple_page>({
  id: "getMePlaylist",
  path: "/me/playlists",
  verb: "GET",
  parameters: []
})

interface SpotifyPaging<Items> {
  items: Items[]
  href
  limit
  next
  offset
  previous
  total
}

interface SpotifyContent<Items> {
  content: Items
  custom_fields: {}
  external_urls: any
  href: string
  id: string
  images: any[]
  name: string
  rendering: string
  tag_line: any
  type: string
}

interface PodcastCategory extends SpotifyPaging<Podcast> {}

interface Podcast {
  available_markets: string[]
  description: string
  external_urls: { spotify: string }
  href: string
  id: string
  is_externally_hosted: boolean
  languages: string[]
  name: string
  type: string
  uri: string
  images: { url: string }[]
}

interface getViewsPodcasts_Params {
  country?: string
  locale?: string
  market?: string // from_token
  timestamp?: string
  platform?: string //web
  content_limit?: number //10
  limit?: number //20
  types?: string //album,playlist,artist,show,station
}

export type getViewsPodcasts_Response = SpotifyContent<
  SpotifyPaging<SpotifyContent<PodcastCategory>>
>

export const getViewsPodcasts = ApiCommon.requestMaker<
  getViewsPodcasts_Params,
  getViewsPodcasts_Response
>({
  id: "getViewsPodcasts",
  path: "/views/podcasts-web",
  verb: "GET",
  parameters: [
    { in: "query", name: "country", required: false },
    { in: "query", name: "locale", required: false },
    { in: "query", name: "market", required: false },
    { in: "query", name: "timestamp", required: false },
    { in: "query", name: "platform", required: false },
    { in: "query", name: "content_limit", required: false },
    { in: "query", name: "limit", required: false },
    { in: "query", name: "types", required: false }
  ]
})
