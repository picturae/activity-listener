import { activityListener } from '../src/activityListener'

// suppress alarming messages in output and make call to function testable
console.warn = jest.fn()
console.log = jest.fn()
console.info = jest.fn()

describe('The functions are executed in a known order when the event occurs', function () {
    let testFunction
    let spyTestFunction
    let normalFunction
    let spyNormalFunction
    let doneFunction
    let spyDoneFunction
    let h2, button, span
    const mouseEvt = {}

    beforeEach(() => {
        document.body.innerHTML = `
            <h2></h2>
            <button><span>Click me!</span></button>
        `
        h2 = document.querySelector('h2')
        button = document.querySelector('button')
        span = document.querySelector('button span')

        testFunction = function () {
            const word = 'Hi'
            h2.textContent = word
            console.warn(word)
        }
        spyTestFunction = jest.spyOn(console, 'warn')
        normalFunction = function () {
            const word = 'Click'
            h2.textContent += word
            console.log(word)
        }
        spyNormalFunction = jest.spyOn(console, 'log')
        doneFunction = function () {
            const word = 'Bye'
            h2.textContent += word
            console.info(word)
        }
        spyDoneFunction = jest.spyOn(console, 'info')

        mouseEvt.click = new MouseEvent('click', {
            bubbles: true,
        })

        button.addEventListener('click', normalFunction)
    })

    afterEach(() => {
        activityListener.destroy()
        button.removeEventListener('click', normalFunction)
        // destroy every spy
        jest.clearAllMocks()
    })

    test('The "Done" function is executed with a delay', () => {
        // The done function is delayed to allow user handlers to finish
        jest.useFakeTimers()

        activityListener.register('click', testFunction, doneFunction)
        span.dispatchEvent(mouseEvt.click)

        jest.runAllTimers()

        expect(spyTestFunction).toHaveBeenCalledWith('Hi')
        expect(spyTestFunction).toHaveBeenCalledTimes(1)

        expect(spyNormalFunction).toHaveBeenCalledWith('Click')
        expect(spyNormalFunction).toHaveBeenCalledTimes(1)

        expect(spyDoneFunction).toHaveBeenCalledWith('Bye')
        expect(spyDoneFunction).toHaveBeenCalledTimes(1)

        expect(h2.textContent).toBe('HiClickBye')
    })

    test('The "Done" function is executed without delay', () => {
        // The done function is executed as latest
        activityListener.register('click', testFunction, doneFunction, 0)
        button.dispatchEvent(mouseEvt.click)

        expect(spyTestFunction).toHaveBeenCalledWith('Hi')
        expect(spyTestFunction).toHaveBeenCalledTimes(1)

        expect(spyNormalFunction).toHaveBeenCalledWith('Click')
        expect(spyNormalFunction).toHaveBeenCalledTimes(1)

        expect(spyDoneFunction).toHaveBeenCalledWith('Bye')
        expect(spyDoneFunction).toHaveBeenCalledTimes(1)

        expect(h2.textContent).toBe('HiClickBye')
    })
})
