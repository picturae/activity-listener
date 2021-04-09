# Activity Listener

Respond to ui-events before or after ordinary event-handlers do.

Usage:
* address obscure tasks:
    blur elements after clicking when peripherals emit enter-keys.

Bad usage:
* cross-tab interaction:
    use localstorage-events or serviceworker messaging
* record user activity:
    you want the [Inactivity Listener](https://www.npmjs.com/package/inactivity-listener)
    for that.

But I can code that myself!
Sure, but this module knows the tricks and can be controlled from different places!

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

To register calls:

```js
const logoff = function () {
    if (!localStorage.authToken && user.name) {
        loginService.logoff()
    }
}
activityListener.register('click', logoff)
```
```js
const blur = function () {
    const focussed = document.querySelector('*:focus')
    if (focussed) {
        focussed.blur()
    }
}
activityListener.register('click', blur)
```

or undo the registration:

```js
activityListener.erase('click', logoff)
activityListener.destroy() // erase all
```
note that 'clear' is now deprecated

flow methods:
```js
activityListener.pause()
activityListener.resume()
```

## Demo

.../activity-listener/demo/activityListener.html
