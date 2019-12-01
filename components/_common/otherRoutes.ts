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
