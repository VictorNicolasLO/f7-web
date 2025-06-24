// flash7Api.ts
// TypeScript module to interact with the Flash7 API from the browser using fetch

export type ApiConfig = {
  baseUrl: string
}

export class Flash7Api {
  private baseUrl: string

  private accessToken: () => Promise<string> = async () => ''

  onError?: (error: Error) => void

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
  }

  setAuthTokens(accessToken: () => Promise<string>) {
    this.accessToken = accessToken
  }

  async status() {
    const res = await fetch(`${this.baseUrl}/api/status`, {
      mode: 'cors'
    })
    return res.text()
  }

  async auth(username: string, password: string) {
    const res = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      mode: 'cors'
    })
    // console.log(res)
    return res.json()
  }

  async callRefreshToken(refreshToken: string) {
    const res = await fetch(`${this.baseUrl}/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      mode: 'cors'
    })
    return res.json()
  }

  async activateUser(jwt?: string) {

    // console.log('Activating user with JWT:')
    const res = await fetch(`${this.baseUrl}/commands/activate-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: jwt || await this.accessToken() }),
      mode: 'cors'
    })
    return res.text()
  }

  async post(postKey: string, content: string) {
    const res = await fetch(`${this.baseUrl}/commands/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), postKey, content }),
      mode: 'cors'
    })
    return res.text()
  }

  async like(postKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), postKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async view(postKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), postKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async comment(postKey: string, content: string) {
    const res = await fetch(`${this.baseUrl}/commands/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), postKey, content }),
      mode: 'cors'
    })
    return res.text()
  }

  async follow(followedKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), followedKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async unfollow(followedKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/unfollow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: await this.accessToken(), followedKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async personalFeed(startSortKey?: string, limit?: number, reverse?: boolean) {
    const res = await fetch(`${this.baseUrl}/queries/personal-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startSortKey, limit, jwt: await this.accessToken(), reverse }),
      mode: 'cors'
    })
    return res.json()
  }

  async globalFeed(startSortKey?: string, limit?: number, reverse?: boolean) {
    const res = await fetch(`${this.baseUrl}/queries/global-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startSortKey, limit, reverse, jwt: await this.accessToken() }),
      mode: 'cors'
    })
    return res.json()
  }

  async comments(postKey: string, startSortKey?: string, limit?: number, reverse?: boolean) {
    const res = await fetch(`${this.baseUrl}/queries/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postKey, startSortKey, limit, reverse }),
      mode: 'cors'
    })
    return res.json()
  }

  async activeUsers(limit?: number, textSearch?: string) {
    const res = await fetch(`${this.baseUrl}/queries/active-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, textSearch, jwt: await this.accessToken() }),
      mode: 'cors'
    })
    return res.json()
  }

  async userTimeline(userKey: string, startSortKey?: string, limit?: number, reverse?: boolean) {
    const res = await fetch(`${this.baseUrl}/queries/user-timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userKey, startSortKey, limit, reverse, jwt: await this.accessToken() }),
      mode: 'cors'
    })
    return res.json()
  }

  async userByKey(userKey: string) {
    const res = await fetch(`${this.baseUrl}/queries/user-by-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userKey, jwt: await this.accessToken() }),
      mode: 'cors'
    })
    return res.json()
  }

  async postByKey(postKey: string) {
    const res = await fetch(`${this.baseUrl}/queries/post-by-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postKey, jwt: await this.accessToken() }),
      mode: 'cors'
    })
    return res.json()
  }
}

export function withErrorHandling<T extends Flash7Api>(api: T): T {
  return new Proxy(api, {
    get(target, prop, receiver) {
      const orig = Reflect.get(target, prop, receiver)
      if (typeof orig === 'function' && prop !== 'onError' && prop !== 'setAuthTokens') {
        return async function (...args: any[]) {
          try {
            // Ensure 'this' refers to the target instance
            console.log(`Calling API method: ${String(prop)}`, args)
            const response = await orig.apply(target, args)
            console.log(`API method ${String(prop)} response:`, response)
            if (response && response.errors) {
              console.log('API Error:', response.errors)
              if (typeof target.onError === 'function') {
                target.onError(response.errors)
              }

              throw new Error(response.errors)
            }
            return response
          } catch (error) {
            console.log('API Error:', error)
            if (typeof target.onError === 'function') {
              target.onError(error instanceof Error ? error : new Error(String(error)))
            }
            throw error
          }
        }
      }
      return orig
    }
  })
}

// Usage example (in your frontend):
// const api = new Flash7Api({ baseUrl: 'http://localhost:3000' })
// await api.auth('user', 'pass')
// const apiWithErrors = withErrorHandling(api)
// apiWithErrors.onError = (err) => { /* handle error */ }
