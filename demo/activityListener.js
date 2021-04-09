
const ordinary = document.querySelector('#ordinary')
const watched = document.querySelector('#watched')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
const aheadOn = document.querySelector('#aheadOn')
const aheadOff = document.querySelector('#aheadOff')
const beforeOn = document.querySelector('#beforeOn')
const beforeOff = document.querySelector('#beforeOff')
const doneOn = document.querySelector('#doneOn')
const doneOff = document.querySelector('#doneOff')
const errorOn = document.querySelector('#errorOn')
const errorOff = document.querySelector('#errorOff')
const textarea = document.querySelector('textarea')

log = function (message) {
    document.querySelector('textarea').value += message + '\n'
}

/* demo */

document.querySelectorAll('button').forEach(
    button => button.addEventListener('click', function () {
        log(`clicked "${button.innerHTML}"`)
    })
)

const interceptionAhead = function (event) {
    if (event.target === watched) {
        log('Ahead of handling "click me" button')
    }
}

const interceptionBefore = function (event) {
    if (event.target === watched) {
        log('Before handling "click me" button')
    }
}

const interceptionDone = function (event) {
    if (event.target === watched) {
        log('Finished handling "click me" button')
    }
}

const interceptionError = function (event) {
    if (event.target === watched) {
        log('Error handling "click me" button')
        activityListener.unknownFunction()
    }
}

const handlingFunction = function (event) {
    if (event.target === watched) {
        log('Handling "click me" button')
    }
}

activityListener.register('click', interceptionAhead)

/* interaction */

aheadOn.addEventListener('click', function () {
    activityListener.register('click', interceptionAhead)
    aheadOff.style.display = ''
    aheadOn.style.display = 'none'
})
aheadOff.addEventListener('click', function () {
    activityListener.erase('click', interceptionAhead)
    aheadOn.style.display = ''
    aheadOff.style.display = 'none'
})
aheadOn.style.display = 'none'

beforeOn.addEventListener('click', function () {
    activityListener.register('click', interceptionBefore)
    beforeOff.style.display = ''
    beforeOn.style.display = 'none'
})
beforeOff.addEventListener('click', function () {
    activityListener.erase('click', interceptionBefore)
    beforeOn.style.display = ''
    beforeOff.style.display = 'none'
})
beforeOff.style.display = 'none'

doneOn.addEventListener('click', function () {
    activityListener.register('click', undefined, interceptionDone, 1000)
    doneOff.style.display = ''
    doneOn.style.display = 'none'
})
doneOff.addEventListener('click', function () {
    activityListener.erase('click', interceptionDone)
    doneOn.style.display = ''
    doneOff.style.display = 'none'
})
doneOff.style.display = 'none'

errorOn.addEventListener('click', function () {
    activityListener.register('click', undefined, interceptionError, 1000)
    errorOff.style.display = ''
    errorOn.style.display = 'none'
})
errorOff.addEventListener('click', function () {
    activityListener.erase('click', interceptionError)
    errorOn.style.display = ''
    errorOff.style.display = 'none'
})
errorOff.style.display = 'none'

pause.addEventListener('click', function () {
    activityListener.pause()
    resume.style.display = ''
    pause.style.display = 'none'
})
resume.addEventListener('click', function () {
    activityListener.resume()
    pause.style.display = ''
    resume.style.display = 'none'
})
resume.style.display = 'none'

textarea.value = ''
