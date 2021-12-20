export let CONFIG: any
try {
  CONFIG = require('../../../.config.local.json')
} catch {
  CONFIG = {}
}
