import { SwaggerRequester, IRequest, IOperation, settings } from "../_oai/api-common"
import Router from "next/router"
import { getMe } from "../_oai/modules/Me"

// ver: babelrc.js
export const WEBSITE_URL = process.env.WEBSITE_URL!
export const CLIENT_ID = process.env.CLIENT_ID
export const SPOFY_ACCOUNTS_URL = process.env.SPOFY_ACCOUNTS_URL
export const SPOFY_REDIRECT_URL = process.env.SPOFY_REDIRECT_URL
export const SPOFY_SERVICE_URL = process.env.SPOFY_SERVICE_URL

console.log("backend url", WEBSITE_URL)

// ver: github wkrueger/swagger-ts-template
class RestRequester extends SwaggerRequester {
  authenticate(parsed: any) {
    localStorage.setItem("auth_token", JSON.stringify(parsed))
  }

  authenticateBetter(token: string) {
    const obj = { access_token: String(token).trim(), better: true }
    localStorage.setItem("auth_token", JSON.stringify(obj))
  }

  getSavedToken(): { access_token?; better? } {
    //fixme: a forma mais correta é usar cookies
    const stored = localStorage.getItem("auth_token") || "{}"
    try {
      return JSON.parse(stored)
    } catch (err) {
      this.clearToken()
      throw err
    }
  }

  private _userId?: string
  async getUserId() {
    if (this._userId) return this._userId!
    const user = await getMe({})
    this._userId = user.id
    return this._userId!
  }

  clearToken() {
    localStorage.clear()
    Router.push("/")
  }

  // @Override
  async handler(
    request: IRequest,
    input: Record<string, any> & GApiCommon.MergeToRequest = {},
    operation?: IOperation
  ) {
    console.log("handler", request, input)
    var token
    if (!input._noAuth) {
      const obj = this.getSavedToken()
      token = obj.access_token
      if (!token) {
        this.clearToken()
        throw Error("Not authenticated.")
      }
      if (input._betterToken && !obj.better) {
        Router.push("/better-token")
        throw Error("We require a better token.")
      }
    }
    const url = new URL(input._directUrl || SPOFY_SERVICE_URL + request.url)
    const params = Object.assign({}, request.query || {}, input._extraQueryParams || {})
    Object.keys(params).forEach(
      key => params[key] !== undefined && url.searchParams.append(key, params[key])
    )
    const body = ["GET", "DELETE"].includes(request.verb!)
      ? undefined
      : JSON.stringify(request.body)
    const headers = {} as Record<string, string>
    if (token) {
      headers.authorization = `Bearer ${token}`
    }
    headers["Content-Type"] = "application/json"
    const fetchResp = await fetch(url.toString(), {
      method: request.verb,
      body,
      headers
    })
    // console.log("fetchresp", request, fetchResp.status)
    if (fetchResp.status == 204) return {}
    if (fetchResp.status == 401) {
      this.clearToken()
      throw Error("Not authenticated.")
    }
    let jsonResp = {}
    try {
      // console.log("parsing", request)
      jsonResp = await fetchResp.json()
      // console.log("parsed", request, jsonResp)
    } catch (err) {
      // console.error("parse error at", request, err)
    }
    if (String(fetchResp.status).substr(0, 1) !== "2") {
      throw jsonResp
    }
    return jsonResp
  }
}

export const requester = new RestRequester()
settings.getRequester = () => requester

declare global {
  namespace GApiCommon {
    interface MergeToRequest {
      _extraQueryParams?: Record<string, any>
      _noAuth?: boolean
      _directUrl?: string
      _betterToken?: boolean
    }
  }
}
