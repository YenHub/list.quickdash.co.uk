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

### GET /list/:ListID

```javascript
javascript: (() => {
  (async () => {
    const listId = prompt("Set listID", "10") || "10";
    const rawResponse = await fetch(`/list/${listId}`, {
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

### PUT /list/update/:ListID (list)

```javascript
javascript: (() => {
  (async () => {
    const listId = prompt("List ID", 2) || 2;
    const rawResponse = await fetch(`/list/update/${listId}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify([
        { notes: "this is one" },
        { notes: "this is another" }
      ])
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
      const listId = prompt("List ID", 2) || 2;
    const rawResponse = await fetch(`/list/${listId}`, {
      method: "DELETE"
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
