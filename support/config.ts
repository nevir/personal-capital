export let CONFIG: any
try {
  CONFIG = require('../.local.config.json')
} catch {
  CONFIG = {}
}
