import * as dialog from 'dialog-node'

import { CONFIG } from './config'

export async function prompt(message: string, title = message): Promise<string> {
  return new Promise((resolve, reject) => {
    dialog.entry(message, title, 0, (code, value, error) => {
      if (code !== 0) {
        reject(new Error(`Prompt failure: ${error} (code ${code})`))
      } else {
        resolve(value)
      }
    })
  })
}

export async function configOrPrompt(key: string, message: string) {
  if (CONFIG[key]) return CONFIG[key]
  return await prompt(message, `Enter configuration details: ${key}`)
}
