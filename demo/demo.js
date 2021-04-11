
const watched = document.querySelector('#watched')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')
const textarea = document.querySelector('textarea')

log = function (message) {
    document.querySelector('textarea').value += message + '\n'
}

/* demo */

// all events for demo button
eventTypes.forEach(type => {
    watched.addEventListener(type, function () {
        log(`${type} on "${watched.textContent}"`)
    })
})

/* togglers */

document.querySelectorAll('article [type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', function () {
        log(`toggled ${checkbox.checked ? 'on' : 'off'} "${checkbox.parentNode.textContent}"`)
    })
})

const ordinary = document.querySelector('#ordinary')
const ordinaryAhead = function (event) {
    if (event.target === watched) {
        log(`Ordinary Ahead for ${event.type} on "${event.target.textContent}"`)
    }
}
ordinary.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, ordinaryAhead))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, ordinaryAhead))
    }
})
eventTypes.forEach(type => activityListener.register(type, ordinaryAhead))
ordinary.checked = true

const stopping = document.querySelector('#stopping')
const stoppingAhead = function (event) {
    if (event.target === watched) {
        log(`Stopping event Ahead for ${event.type} on "${event.target.textContent}"`)
        event.stopPropagation()
    }
}
stopping.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, stoppingAhead))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, stoppingAhead))
    }
})
stopping.checked = false

const faulty = document.querySelector('#faulty')
const faultyHandler = function (event) {
    if (event.target === watched) {
        log(`Faulty Handler for ${event.type} on "${event.target.textContent}"`)
        activityListener.unknownFunction()
    }
}
faulty.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, faultyHandler))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, faultyHandler))
    }
})
faulty.checked = false


const instant = document.querySelector('#instant')
const instantDone = function (event) {
    if (event.target === watched) {
        log(`Instant Done for ${event.type} on "${event.target.textContent}"`)
    }
}
instant.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, instantDone, 0))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, instantDone))
    }
})
instant.checked = false

const defaulting = document.querySelector('#default')
const defaultDone = function (event) {
    if (event.target === watched) {
        log(`Default Done for ${event.type} on "${event.target.textContent}"`)
    }
}
defaulting.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, defaultDone))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, defaultDone))
    }
})
eventTypes.forEach(type => activityListener.register(type, undefined, defaultDone))
defaulting.checked = true

const delayed = document.querySelector('#delayed')
const delayedDone = function (event) {
    if (event.target === watched) {
        log(`Delayed Done for ${event.type} on "${event.target.textContent}"`)
    }
}
delayed.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, delayedDone, 500))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, delayedDone))
    }
})
delayed.checked = false

/* footer */

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
