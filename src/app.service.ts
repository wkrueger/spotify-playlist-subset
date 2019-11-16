import { Injectable } from '@nestjs/common'
import { AuthService } from './api/oai/AuthService'
import { urlWithQueryParameters } from './api/requester'

@Injectable()
export class AppService {
  constructor(public auth: AuthService) {}

  getAuthUrl() {
    const base = 'https://accounts.spotify.com/authorize'
    const params = {
      client_id: this.auth.SPOTIFY_CLIENT_ID,
      response_type: 'code',
      redirect_uri: 'http://localhost:3000/callback',
      scope: [
        'user-read-recently-played',
        'user-top-read',
        'user-library-read',
        'playlist-modify-private',
      ].join(' '),
    }
    const url = urlWithQueryParameters(base, params)
    return url
  }
}
