import { activityListener } from '../src/activityListener'

// suppress alarming messages in output and make call to function testable
console.warn = jest.fn()

describe('The API', function () {
    let testFunction
    let spyTestFunction
    const mouseEvt = {}

    beforeEach(() => {
        testFunction = function () {
            console.warn('Hi')
        }
        activityListener.register('click', testFunction)
        spyTestFunction = jest.spyOn(console, 'warn')
        mouseEvt.clickRoot = new MouseEvent('click', {
            target: document.documentElement,
        })
    })

    afterEach(() => {
        activityListener.destroy()
        // destroy every spy
        jest.clearAllMocks()
    })

    test('The registered function is executed when the event occurs', () => {
        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).toHaveBeenCalledWith('Hi')
        expect(spyTestFunction).toHaveBeenCalledTimes(1)
    })

    test(`An erased function will not be executed,
        unless it's registered again`, () => {
        activityListener.erase('click', testFunction)
        activityListener.register('click', testFunction)
        activityListener.erase('click', testFunction)

        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).not.toHaveBeenCalled()

        activityListener.register('click', testFunction)

        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).toHaveBeenCalledWith('Hi')
        expect(spyTestFunction).toHaveBeenCalledTimes(1)

        activityListener.erase('click', testFunction)

        window.dispatchEvent(mouseEvt.clickRoot)

        // the called count will not rise
        expect(spyTestFunction).toHaveBeenCalledTimes(1)
    })

    test('A destroyed module will not execute anything', () => {
        activityListener.destroy()

        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).not.toHaveBeenCalled()
    })

    test(`A module will not execute anything when its is paused,
        until it resumes`, () => {
        activityListener.pause()

        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).not.toHaveBeenCalled()

        activityListener.resume()

        window.dispatchEvent(mouseEvt.clickRoot)

        expect(spyTestFunction).toHaveBeenCalledWith('Hi')
        expect(spyTestFunction).toHaveBeenCalledTimes(1)

        activityListener.pause()

        window.dispatchEvent(mouseEvt.clickRoot)

        // the called count will not rise
        expect(spyTestFunction).toHaveBeenCalledTimes(1)
    })
})
