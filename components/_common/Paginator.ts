import { requester } from "./requester"

export abstract class Paginator<T> {
  next?: string
  data = null as T[] | null

  abstract _getPage(): Promise<{ data: T[]; next?: string }>

  async getPage() {
    const resp = await this._getPage()
    this.next = resp.next
    return resp.data
  }

  hasMore() {
    return Boolean(this.next)
  }

  async getMore() {
    if (!this.hasMore) return this.data || []
    const resp: any = await requester.handler({
      url: this.next!
    })
    this.next = resp.next
    this.data = [...(this.data || []), ...(resp.items || [])]
    return this.data
  }
}
