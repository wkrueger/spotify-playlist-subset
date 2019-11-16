import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
}
