import { PersonalCapital } from 'personal-capital'
import { APIError } from '../../../src/categories/API'

import { MockAPIClient } from '../../support/mocks/MockAPIClient'

describe('PersonalCapital/API', () => {

  let api: MockAPIClient
  let client: PersonalCapital
  beforeEach(() => {
    api = new MockAPIClient()
    client = new PersonalCapital(api)
  })

  describe('call', () => {

    it('makes calls via the API client', async () => {
      await client.call('login/querySession', {})

      expect(api.call).toHaveBeenCalledWith('login/querySession', expect.any(Object))
    })

    describe('errors', () => {

      it('throws an APIError for any responses w/ a falsy success header', async () => {
        api.call.mockResolvedValue({
          spHeader: { success: false }
        })

        await expect(async () => {
          await client.call('login/querySession', {})
        }).rejects.toThrowError(APIError)
      })

      it('passes error information along', async () => {
        api.call.mockResolvedValue({
          spHeader: {
            success: false,
            errors: [
              { code: 123, message: 'bewm' }
            ]
          }
        })

        let error: APIError | undefined
        try {
          await client.call('login/querySession', {})
        } catch (thrown) {
          error = thrown as APIError
        }

        expect(error!.errors).toEqual([
          { code: 123, message: 'bewm' }
        ])
        expect(error!.message).toMatch(/bewm/)
        expect(error!.message).toMatch(/querySession/)
      })

    })

    describe('CSRF tokens', () => {

      it('are initially retrieved via getInitialCsrfToken()', async () => {
        await client.call('login/querySession', {})

        expect(api.getInitialCsrfToken).toHaveBeenCalledTimes(1)
      })

      it('are passed as a param', async () => {
        await client.call('login/querySession', {})

        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          csrf: 'initial-csrf-token'
        }))
      })

      it('are tracked in responses', async () => {
        api.call.mockResolvedValue({
          spHeader: { success: true, csrf: 'new-csrf-token' },
          spData: {}
        })
        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          csrf: 'initial-csrf-token'
        }))

        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          csrf: 'new-csrf-token'
        }))
      })

    })

    describe('last server change ids', () => {

      it('is -1 if not yet known', async () => {
        await client.call('login/querySession', {})

        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: -1
        }))
      })

      it('are tracked in responses', async () => {
        api.call.mockResolvedValue({
          spHeader: {
            success: true,
            SP_DATA_CHANGES: [
              { serverChangeId: 123 }
            ]
          },
          spData: {}
        })
        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: -1
        }))

        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: 123
        }))
      })

      it('ignores older server change ids', async () => {
        api.call.mockResolvedValue({
          spHeader: {
            success: true,
            SP_DATA_CHANGES: [
              { serverChangeId: 123 }
            ]
          },
          spData: {}
        })
        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: -1
        }))

        api.call.mockResolvedValue({
          spHeader: {
            success: true,
            SP_DATA_CHANGES: [
              { serverChangeId: 111 }
            ]
          },
          spData: {}
        })
        await client.call('login/querySession', {})
        expect(api.call).toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: 123
        }))

        await client.call('login/querySession', {})
        expect(api.call).not.toHaveBeenCalledWith('login/querySession', expect.objectContaining({
          lastServerChangeId: 111
        }))
      })
    })

  })

  describe('session', () => {

    it('throws if you try to access before a call()', () => {
      expect(() => {
        client.session
      }).toThrow(/session.*call/i)
    })

    it('exposes the CSRF token', async () => {
      await client.call('login/querySession', {})

      expect(client.session.csrf).toEqual('initial-csrf-token')
    })

    it('exposes the last server change id, if known', async () => {
      await client.call('login/querySession', {})
      expect(client.session.changeId).toEqual(undefined)

      api.call.mockResolvedValue({
        spHeader: {
          success: true,
          SP_DATA_CHANGES: [
            { serverChangeId: 123 }
          ]
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.changeId).toEqual(123)
    })

    it('exposes the authentication level', async () => {
      api.call.mockResolvedValue({
        spHeader: {
          success: true,
          authLevel: 'SESSION_AUTHENTICATED',
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.authenticationLevel).toEqual('SESSION_AUTHENTICATED')
    })

    it('includes user related metadata when available', async () => {
      api.call.mockResolvedValue({
        spHeader: {
          betaTester: false,
          developer: false,
          isDelegate: false,
          personId: 12345,
          qualifiedLead: true,
          status: 'ACTIVE',
          success: true,
          userGuid: 'abcd1234',
          username: 'foo@bar.example',
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.user).toEqual({
        email: 'foo@bar.example',
        id: 12345,
        guid: 'abcd1234',
        status: 'ACTIVE',
        isDelegate: false,
        isQualifiedLead: true,
        isBetaTester: false,
        isDeveloper: false,
      })
    })

    it('includes device related metadata when available', async () => {
      api.call.mockResolvedValue({
        spHeader: {
          deviceName: 'Some Test Device',
          success: true,
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.device).toEqual({
        name: 'Some Test Device',
      })
    })

    it('includes account related metadata via accountsSummary when available', async () => {
      api.call.mockResolvedValue({
        spHeader: {
          accountsSummary: {
            hasAggregated: true,
            hasCash: true,
            hasCredit: true,
            hasInvestment: true,
            hasOnUs: true,
          },
          success: true,
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.account).toEqual({
        hasAggregated: true,
        hasCash: true,
        hasCredit: true,
        hasInvestment: true,
        hasOnUs: true,
      })
    })

    it('includes account related metadata via accountsMetaData when available', async () => {
      api.call.mockResolvedValue({
        spHeader: {
          accountsMetaData: ['HAS_CASH', 'HAS_CREDIT', 'HAS_INVESTMENT', 'HAS_ON_US'],
          success: true,
        },
        spData: {}
      })
      await client.call('login/querySession', {})

      expect(client.session.account).toEqual({
        hasAggregated: false,
        hasCash: true,
        hasCredit: true,
        hasInvestment: true,
        hasOnUs: true,
      })
    })
  })

})
