const activityListener = (function () {
    // internal state; isRunning - Boolean
    let isRunning = true
    // lookup, wrapped callback by eventType
    const registry = {}

    /**
     * Execute callback with checks
     * @private
     * @param {Function} timer - wrapped callback
     */
    const execute = function (callback, delay, event) {
        if (!isRunning) {
            return
        }
        const tryCatch = function () {
            try {
                callback(event)
            } catch (error) {
                console.error('activityListener caught faulty callback')
            }
        }
        if (!delay) {
            tryCatch()
        } else {
            setTimeout(tryCatch, delay)
        }
    }

    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     * @param {String} type - eventType
     * @param {Function} callback - external function to call in case of event
     */
    const eventHandling = function (aim, type, callback) {
        const handler = `on${type}`
        const procedure = registry[type].get(callback).procedure
        const eventOptions = registry[type].get(callback).options
        if (handler in window) {
            window[aim + 'EventListener'](type, procedure, eventOptions)
        } else if (handler in document) {
            document[aim + 'EventListener'](type, procedure, eventOptions)
        } else if (aim === 'add') {
            console.warn(`activityListener rejected ${type}-event`)
        }
    }

    /**
     * Attach callback to event.
     * @param {String} type - event type to watch
     * @param {Function} ahead - to execute first
     * @param {Function} done - to execute after all
     * @param {Number} doneDelay - milliseconds to allow regular event-handler to finish
     */
    const register = function (type, ahead, done, doneDelay = 50) {
        const enroll = function (callback, options, delay) {
            const procedure = function (event) {
                execute(callback, delay, event)
            }
            if (!registry[type]) {
                registry[type] = new Map()
            }
            registry[type].set(callback, {
                procedure: procedure,
                options: options,
            })
            eventHandling('add', type, callback)
        }
        if (ahead) {
            enroll(ahead, { passive: true, capture: true }, 0)
        }
        if (done) {
            enroll(done, { passive: true, capture: false }, doneDelay)
        }
    }

    /**
     * Detach event/callback pair.
     * @param {String} type - event type to watch
     * @param {Function} callback
     */
    const erase = function (type, callback) {
        eventHandling('remove', type, callback)
        registry[type].delete(callback)
        if (!registry[type].size) {
            delete registry[type]
        }
    }

    /**
     * Erase all callbacks, without knowing them :-)
     */
    const destroy = function () {
        Object.keys(registry).forEach((type) => {
            for (let key of registry[type].keys()) {
                erase(type, key)
            }
        })
    }

    /**
     * Expose callbacks
     */
    const resume = function () {
        isRunning = true
    }

    /**
     * Block callbacks
     */
    const pause = function () {
        isRunning = false
    }

    return {
//         debug: () => console.log('registry', registry),
        clear: destroy, // deprecated
        destroy: destroy,
        erase: erase,
        pause: pause,
        register: register,
        resume: resume,
    }
})()

export { activityListener }
