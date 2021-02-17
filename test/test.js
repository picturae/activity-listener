import { activityListener } from '../src/activityListener'

describe('The API', function () {
    beforeAll(() => {})

    afterEach(() => {})

    test('There is a register function', () => {
        expect(typeof activityListener.register).toBe('function')
    })

    test('There is an erase function', () => {
        expect(typeof activityListener.register).toBe('function')
    })
})
