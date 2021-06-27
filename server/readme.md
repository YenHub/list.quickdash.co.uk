## Bookmarklet Dev Helpers

### GET (All)

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const content = await rawResponse.json();
    console.log(content);
  })();
})();
```

### GET /list: (listId)

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ listId: 10000 })
    });
    const content = await rawResponse;
    console.log(content);
  })();
})();
```

### POST /list/create:

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        list: [
          { notes: "this is one" },
          { notes: "this is another" },
          { notes: "Lots of notes" },
          { notes: "Some more things to add" }
        ]
      })
    });
    const content = await rawResponse.json();

    console.log(content);
  })();
})();
```

### POST /list/random:

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/random", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ listId: 10 })
    });
    const content = await rawResponse;

    console.log(content);
  })();
})();
```

### PUT /list/update: (listId, list)

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        listId: 1,
        list: [{ notes: "this is one" }, { notes: "this is another" }]
      })
    });
    const content = await rawResponse;
    console.log(content);
  })();
})();
```

e.g. DELETE

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ listId: 1 })
    });
    const content = await rawResponse;
    console.log(content);
  })();
})();
```

e.g. DELETE (ALL)

```javascript
javascript: (() => {
  (async () => {
    const rawResponse = await fetch("/list/all", {
      method: "DELETE"
    });
    const content = await rawResponse;
    console.log(content);
  })();
})();
```
