const activityListener = (function () {
    /**
     * Add or remove EventListeners
     * @private
     * @param {String} aim - 'add' | 'remove'
     * @param {String} type - eventType
     * @param {Function} callback - external function to call in case of event
     */
    const eventHandling = function (aim, type, callback) {
        const eventOptions = { passive: true, capture: true }
        const handler = `on${type}`
        if (handler in window) {
            window[aim + 'EventListener'](type, callback, eventOptions)
        } else if (handler in document) {
            document[aim + 'EventListener'](type, callback, eventOptions)
        } else if (aim === 'add') {
            console.warn(`activityListener rejected ${type}-event`)
        }
    }

    /**
     * Attach callback to event.
     * @param {String} type - event type to watch
     * @param {Function} callback
     */
    const register = function (type, callback) {
        eventHandling('add', type, callback)
    }

    /**
     * Detach event/callback pair.
     * @param {String} type - event type to watch
     * @param {Function} callback
     */
    const erase = function (type, callback) {
        eventHandling('remove', type, callback)
    }

    return {
        erase: erase,
        register: register,
    }
})()

export { activityListener }
