if you've called the .v4 endpoint on that
it should have worked btw

https://github.com/uuidjs/uuid/blob/master/src/rng-browser.js
src/rng-browser.js

```javascript
// Unique ID creation requires a high quality random # generator. In the browser we therefore
// require the crypto API and do not support built-in fallback to lower quality random number
// generators (like Math.random()).

let getRandomValues;
```

<https://github.com/uuidjs/uuid|uuidjs/uuid>uuidjs/uuid | Added by GitHub (Legacy)
https://github.com/uuidjs/uuid/blob/master/src/rng-browser.js#L14-L20
src/rng-browser.js:14-20

```
    getRandomValues =
      (typeof crypto !== 'undefined' &&
        crypto.getRandomValues &&
        crypto.getRandomValues.bind(crypto)) ||
      (typeof msCrypto !== 'undefined' &&
```

<https://github.com/uuidjs/uuid|uuidjs/uuid>uuidjs/uuid | Added by GitHub (Legacy)

that's the browser side
should be random

if this is the server side
