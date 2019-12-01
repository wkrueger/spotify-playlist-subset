import { requester } from "./requester"

export abstract class Paginator<T> {
  next?: string
  data = null as T[] | null
  total?: number

  abstract _getPage(): Promise<{ data: T[]; next?: string; total: number }>

  async getPage() {
    const resp = await this._getPage()
    this.next = resp.next
    this.data = resp.data || []
    this.total = resp.total
    return resp.data
  }

  hasMore() {
    return Boolean(this.next)
  }

  getTotal() {
    return this.total
  }

  async getMore() {
    if (!this.hasMore()) return this.data || []
    const resp: any = await requester.handler({} as any, { _directUrl: this.next })
    this.next = resp.next
    this.data = [...(this.data || []), ...(resp.items || [])]
    return this.data
  }
}
