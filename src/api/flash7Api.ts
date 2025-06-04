// flash7Api.ts
// TypeScript module to interact with the Flash7 API from the browser using fetch

export type ApiConfig = {
  baseUrl: string
}

export class Flash7Api {
  private baseUrl: string

  private accessToken?: string
  private refreshToken?: string

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
  }

  setAuthTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  async status() {
    const res = await fetch(`${this.baseUrl}/api/status`, { mode: 'cors' })
    return res.text()
  }

  async auth(username: string, password: string) {
    const res = await fetch(`${this.baseUrl}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      mode: 'cors'
    })
    console.log(res)
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
    console.log('Activating user with JWT:')
    const res = await fetch(`${this.baseUrl}/commands/activate-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt : jwt || this.accessToken }),
      mode: 'cors'
    })
    return res.text()
  }

  async post(postKey: string, content: string) {
    const res = await fetch(`${this.baseUrl}/commands/post`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, postKey, content }),
      mode: 'cors'
    })
    return res.text()
  }

  async like(postKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, postKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async view(postKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, postKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async comment(postKey: string, content: string) {
    const res = await fetch(`${this.baseUrl}/commands/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, postKey, content }),
      mode: 'cors'
    })
    return res.text()
  }

  async follow(followedKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, followedKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async unfollow(followedKey: string) {
    const res = await fetch(`${this.baseUrl}/commands/unfollow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jwt: this.accessToken, followedKey }),
      mode: 'cors'
    })
    return res.text()
  }

  async personalFeed(userKey: string, startSortKey?: string, limit?: number) {
    const res = await fetch(`${this.baseUrl}/queries/personal-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userKey, startSortKey, limit }),
      mode: 'cors'
    })
    return res.json()
  }

  async globalFeed(startSortKey?: string, limit?: number) {
    const res = await fetch(`${this.baseUrl}/queries/global-feed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ startSortKey, limit }),
      mode: 'cors'
    })
    return res.json()
  }

  async comments(postKey: string, startSortKey?: string, limit?: number) {
    const res = await fetch(`${this.baseUrl}/queries/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postKey, startSortKey, limit }),
      mode: 'cors'
    })
    return res.json()
  }

  async activeUsers(limit?: number, postKey?: string, textSearch?: string) {
    const res = await fetch(`${this.baseUrl}/queries/active-users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit, postKey, textSearch }),
      mode: 'cors'
    })
    return res.json()
  }

  async userTimeline(userKey: string, startSortKey?: string, limit?: number) {
    const res = await fetch(`${this.baseUrl}/queries/user-timeline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userKey, startSortKey, limit }),
      mode: 'cors'
    })
    return res.json()
  }
}

// Usage example (in your frontend):
// const api = new Flash7Api({ baseUrl: 'http://localhost:3000' })
// await api.auth('user', 'pass')
