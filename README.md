# Activity Listener

Respond to events in the browser window on a low level.
Uses:
* redirect to the login page when the user logged off in another browser tab.
* blur elements after clicking.

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
    if (!localStorage.authToken && user.name) {
        loginService.logoff()
    }
}
activityListener.register('click', blur)
```

or stop:

```
activityListener.erase('click', logoff)
```

## Demo

.../activity-listener/demo/activityListener.html
