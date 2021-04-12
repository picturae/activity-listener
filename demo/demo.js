
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

const simple_ahead = document.querySelector('#simple_ahead')
const simpleAhead = function (event) {
    if (event.target === watched) {
        log(`Simple Ahead of ${event.type} on "${event.target.textContent}"`)
    }
}
simple_ahead.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, simpleAhead))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, simpleAhead))
    }
})

const stopping_ahead = document.querySelector('#stopping_ahead')
const stoppingAhead = function (event) {
    if (event.target === watched) {
        log(`Stop Propagation Ahead of ${event.type} on "${event.target.textContent}"`)
        event.stopPropagation()
    }
}
stopping_ahead.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, stoppingAhead))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, stoppingAhead))
    }
})

const faulty_handler = document.querySelector('#faulty_handler')
const faultyHandler = function (event) {
    if (event.target === watched) {
        log(`Faulty Handler for ${event.type} on "${event.target.textContent}"`)
        activityListener.unknownFunction()
    }
}
faulty_handler.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, faultyHandler))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, faultyHandler))
    }
})


const simple_action = document.querySelector('#simple_action')
const simpleAction = function (event) {
    if (event.target === watched) {
        log(`Simple Action for ${event.type} on "${event.target.textContent}"`)
    }
}
simple_action.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, simpleAction))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, simpleAction))
    }
})

const stopping_action = document.querySelector('#stopping_action')
const stoppingAction = function (event) {
    if (event.target === watched) {
        log(`Stop Propagation Action for ${event.type} on "${event.target.textContent}"`)
        event.stopPropagation()
    }
}
stopping_action.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, stoppingAction))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, stoppingAction))
    }
})


const instant_done = document.querySelector('#instant_done')
const instantDone = function (event) {
    if (event.target === watched) {
        log(`Instant Done for ${event.type} on "${event.target.textContent}"`)
    }
}
instant_done.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, instantDone, 0))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, instantDone))
    }
})

const default_done = document.querySelector('#default_done')
const defaultDone = function (event) {
    if (event.target === watched) {
        log(`Default Done for ${event.type} on "${event.target.textContent}"`)
    }
}
default_done.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, defaultDone))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, defaultDone))
    }
})

const delayed_done = document.querySelector('#delayed_done')
const delayedDone = function (event) {
    if (event.target === watched) {
        log(`Delayed Done for ${event.type} on "${event.target.textContent}"`)
    }
}
delayed_done.addEventListener('click', function () {
    if (this.checked) {
        eventTypes.forEach(type => activityListener.register(type, undefined, delayedDone, 500))
    } else {
        eventTypes.forEach(type => activityListener.erase(type, delayedDone))
    }
})


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
