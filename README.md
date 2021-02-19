# Activity Listener

Respond to events in the browser window on a low level.

Uses:
* cross-tab interaction:
    redirect to the login page when authentication token can't be read.
* address obscure tasks:
    blur elements after clicking while peripherals emit enter-keys.

But I can code that myself!
Sure, but this module knows the tricks and can be controlled from different places!

## Install

Install the package as npm package. Provided are
a umd-formatted file in the dist folder to require or just read
and an es-module in the module folder to import.

## Usage

To register calls:

```
const logoff = function () {
    if (!localStorage.authToken && user.name) {
        loginService.logoff()
    }
}
activityListener.register('click', logoff)
```
```
const blur = function () {
    const focussed = document.querySelector('*:focus')
    if (focussed) {
        focussed.blur()
    }
}
activityListener.register('click', blur)
```

or stop:

```
activityListener.erase('click', logoff)
activityListener.clear() // erase all
```

flow methods:
```
activityListener.pause()
activityListener.resume()
```

## Demo

.../activity-listener/demo/activityListener.html
