export interface CookieJar {
  getCookieString(currentUrl: string): Promise<string>
  setCookie(cookie: string, currentUrl: string): Promise<any>
}
