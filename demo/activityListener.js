
const ordinary = document.querySelector('#ordinary')
const watched = document.querySelector('#watched')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
const aheadOn = document.querySelector('#aheadOn')
const aheadOff = document.querySelector('#aheadOff')
const beforeOn = document.querySelector('#beforeOn')
const beforeOff = document.querySelector('#beforeOff')
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
