import {
  SwaggerRequester,
  IRequest,
  IOperation,
  settings,
  requestMaker,
} from './oai/api-common'

class RestRequester extends SwaggerRequester {
  async handler(
    request: IRequest & GApiCommon.MergeToRequest,
    input: Record<string, any>,
    operation: IOperation,
  ) {
    // const token = this.getCurrentToken().access
    const body = ['GET', 'DELETE'].includes(request.verb!)
      ? undefined
      : JSON.stringify(request.body)
    const headers = {} as Record<string, string>
    // if (token) {
    //   headers.authorization = `Bearer ${token}`
    // }
    if (body) {
      headers['Content-Type'] = 'application/json'
    }
    const url = urlWithQueryParameters(BACKEND_URL + request.url, request.query)
    const fetchResp = await fetch(url, {
      method: request.verb,
      body,
      headers,
    })
    if (fetchResp.status === 204) return {}
    return fetchResp.json()
  }
}

export const requester = new RestRequester()
settings.getRequester = () => requester

export function urlWithQueryParameters(
  base: string,
  qp: Record<string, string> = {},
) {
  const url = new URL(base)
  Object.keys(qp).forEach(key => url.searchParams.append(key, qp[key]))
  return url.toString()
}

type Authorize_Req = {
  client_id
  response_type
  redirect_uri
  state?
  scope?
  show_dialog?
}

const authorizeMethod = requestMaker<Authorize_Req, {}>({
  id: 'accountAuthorize',
  verb: 'GET',
  path: '/authorize',
  parameters: [
    { in: 'query', name: 'client_id' },
    { in: 'query', name: 'response_type' },
    { in: 'query', name: 'redirect_uri' },
    { in: 'query', name: 'state' },
    { in: 'query', name: 'scope' },
    { in: 'query', name: 'show_dialog' },
  ],
})

async function spotifyAuthorize() {}

declare global {
  namespace GApiCommon {
    interface MergeToRequest {
      _baseUrl?: string
    }
  }
}
