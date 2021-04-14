import { activityListener } from '../src/activityListener'

describe('Coherence between registered handlers', function () {
    let testFunction
    let spyTestFunction
    let normalFunction
    let spyNormalFunction
    let doneFunction
    let spyDoneFunction
    let stopFunction
    let spyStopFunction

    let h2, button
    const mouseEvt = {}
    const methods = {}

    beforeEach(() => {
        document.body.innerHTML = `
            <h2></h2>
            <button><span>Click me!</span></button>
        `
        h2 = document.querySelector('h2')
        button = document.querySelector('button')

        methods.test = () => {}
        testFunction = function () {
            const word = 'Hi'
            h2.textContent = word
            methods.test(word)
        }
        spyTestFunction = jest.spyOn(methods, 'test')

        methods.normal = () => {}
        normalFunction = function () {
            const word = 'Click'
            h2.textContent += word
            methods.normal(word)
        }
        spyNormalFunction = jest.spyOn(methods, 'normal')

        methods.done = () => {}
        doneFunction = function () {
            const word = 'Bye'
            h2.textContent += word
            methods.done(word)
        }
        spyDoneFunction = jest.spyOn(methods, 'done')

        methods.stop = () => {}
        stopFunction = function (ev) {
            const word = 'Stop'
            h2.textContent += word
            methods.stop(word)
            ev.stopPropagation()
        }
        spyStopFunction = jest.spyOn(methods, 'stop')

        mouseEvt.click = new MouseEvent('click', {
            bubbles: true,
        })
        mouseEvt.focus = new MouseEvent('focus', {
            bubbles: false,
        })

        jest.useFakeTimers()
    })

    afterEach(() => {
        activityListener.destroy()
        button.removeEventListener('click', normalFunction)
        // destroy every spy
        jest.clearAllMocks()
    })

    describe(`Calling stopPropagation will not prevent execution Done handler`, function () {
        test(`Neither handler stops propagation`, () => {
            button.addEventListener('click', normalFunction)
            activityListener.register('click', testFunction, doneFunction)
            button.dispatchEvent(mouseEvt.click)
            jest.runAllTimers()

            // ahead
            expect(spyTestFunction).toHaveBeenCalledTimes(1)
            // ordinary
            expect(spyNormalFunction).toHaveBeenCalledTimes(1)
            // done
            expect(spyDoneFunction).toHaveBeenCalledTimes(1)
            // not
            expect(spyStopFunction).toHaveBeenCalledTimes(0)

            button.removeEventListener('click', normalFunction)
        })

        test(`The ordinary handler stops propagation`, () => {
            button.addEventListener('click', stopFunction)
            activityListener.register('click', testFunction, doneFunction)
            button.dispatchEvent(mouseEvt.click)
            jest.runAllTimers()

            // ahead
            expect(spyTestFunction).toHaveBeenCalledTimes(1)
            // ordinary
            expect(spyStopFunction).toHaveBeenCalledTimes(1)
            // done
            expect(spyDoneFunction).toHaveBeenCalledTimes(1)
            // not
            expect(spyNormalFunction).toHaveBeenCalledTimes(0)

            button.removeEventListener('click', stopFunction)
        })

        test(`The Ahead handler stops propagation`, () => {
            button.addEventListener('click', normalFunction)
            activityListener.register('click', stopFunction, doneFunction)
            button.dispatchEvent(mouseEvt.click)
            jest.runAllTimers()

            // ahead
            expect(spyStopFunction).toHaveBeenCalledTimes(1)
            // ordinary
            expect(spyNormalFunction).toHaveBeenCalledTimes(0)
            // done
            expect(spyDoneFunction).toHaveBeenCalledTimes(1)
            // not
            expect(spyTestFunction).toHaveBeenCalledTimes(0)

            button.removeEventListener('click', normalFunction)
        })

        test(`Removing the Done handler will prevent execution if its timer`, () => {
            button.addEventListener('click', normalFunction)
            activityListener.register('click', stopFunction, doneFunction)
            activityListener.erase('click', doneFunction)
            button.dispatchEvent(mouseEvt.click)
            jest.runAllTimers()

            // ahead
            expect(spyStopFunction).toHaveBeenCalledTimes(1)
            // ordinary
            expect(spyNormalFunction).toHaveBeenCalledTimes(0)
            // done
            expect(spyDoneFunction).toHaveBeenCalledTimes(0)
            // not
            expect(spyTestFunction).toHaveBeenCalledTimes(0)

            button.removeEventListener('click', normalFunction)
        })
    })
})
