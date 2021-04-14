const activityListener = (function () {
    // internal state; isRunning - Boolean
    let isRunning = true
    const defaultDoneDelay = 50
    const aheadOptions = { passive: true, capture: true }
    const doneOptions = { passive: true, capture: false }
    // lookup, wrapped callback by eventType
    const registry = {}
    // currently present events
    const presence = {}

    /**
     * Execute callback with checks
     * @private
     * @param {Function} callback
     * @param {Number} delay
     * @param {Event} event
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
     * Setup tracker for event, in case of done handler.
     * @private
     * @param {String} type - eventType
     * @param {Function} procedure - wrapped callback
     * @param {Number} doneDelay - milliseconds to allow regular event-handler to finish
     * @return {Function} stackSpareDoneFunction - function containing doneFunction
     */
    const trackEventPropagation = function (type, procedure, doneDelay) {
        /**
         * Stack execution of done handler, in case stopPropagation was called earlier.
         * @private
         * @param {Event} event
         */
        const stackDoneTimer = function (event) {
            const presenceId = `${event.type}-${event.timeStamp}`
            const timerId = setTimeout(function () {
                if (presence[presenceId]) {
                    procedure(event)
                }
            }, doneDelay + defaultDoneDelay / 2)
            presence[presenceId] = timerId
        }
        eventHandling('add', type, stackDoneTimer, aheadOptions)
        return stackDoneTimer
    }

    /**
     * Clear stacked execution of done handler.
     * @private
     * @param {Event} event
     */
    const clearDoneTimer = function (event) {
        const presenceId = `${event.type}-${event.timeStamp}`
        if (presence[presenceId]) {
            clearTimeout(presence[presenceId])
            delete presence[presenceId]
        }
    }

    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     * @param {String} type - eventType
     * @param {Function} callback - external function to call in case of event
     * @param {Object} options - options responding to an event
     */
    const eventHandling = function (aim, type, callback, options) {
        const handler = `on${type}`
        if (handler in window) {
            window[aim + 'EventListener'](type, callback, options)
        } else if (handler in document) {
            document[aim + 'EventListener'](type, callback, options)
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
    const register = function (
        type,
        ahead,
        done,
        doneDelay = defaultDoneDelay,
    ) {
        const enroll = function (callback, options, delay) {
            const procedure = function (event) {
                clearDoneTimer(event)
                execute(callback, delay, event)
            }

            if (!registry[type]) {
                registry[type] = new Map()
            }
            const callData = {
                procedure: procedure,
                options: options,
            }
            eventHandling('add', type, procedure, options)

            if (options.capture === false) {
                callData.timer = trackEventPropagation(
                    type,
                    procedure,
                    doneDelay,
                )
            }

            registry[type].set(callback, callData)
        }
        if (ahead) {
            enroll(ahead, aheadOptions, 0)
        }
        if (done) {
            enroll(done, doneOptions, doneDelay)
        }
        return function () {
            if (ahead) {
                erase(type, ahead)
            }
            if (done) {
                erase(type, done)
            }
        }
    }

    /**
     * Detach event/callback pair.
     * @param {String} type - event type to watch
     * @param {Function} callback
     */
    const erase = function (type, callback) {
        const procedure = registry[type].get(callback).procedure
        const options = registry[type].get(callback).options
        eventHandling('remove', type, procedure, options)

        const timer = registry[type].get(callback).timer
        eventHandling('remove', type, timer, aheadOptions)

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
        clear: destroy, // deprecated
        destroy: destroy,
        erase: erase,
        pause: pause,
        register: register,
        resume: resume,
    }
})()

export { activityListener }
