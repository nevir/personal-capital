import { PersonalCapital } from 'personal-capital'

import { MockAPIClient } from '../support/mocks/MockAPIClient'

describe('PersonalCapital', () => {
  const client = new PersonalCapital(new MockAPIClient())

  it('does nothing yet', () => { })
})
