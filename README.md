# express-string-controllers

Reduce imports in your expressjs apps using a controllers wrapper

# Installation

## Using NPM
```sh
  npm install express-string-controllers --save
```

## Using Yarn legacy 
```sh
  yarn add express-string-controllers
```

# Quick start

If your folder structure is something like this:
<br/>
- src
  - index.ts
  - controllers
    - PetsController.ts

index.ts
```js
import express from 'express';
import App, { IExpress } from 'express-string-controllers';

// wrap your express app
const app: IExpress = new App(express());

app.get('/pets', 'PetsController.getPets');

// Replace with your port number
app.listen(4000, () => {
  console.log('app started');
});
```

PetsController.ts
```js
class PetsController {
  static async getPets(req, res, next) {
    return res.status(200).json({
      pets: ['dog', 'cat']
    });
  }
};

export default PetsController;
```

You can also dictate your controllers folder path manually:

<br/>

- src
  - index.ts
  - custom
    - custom_controller
      - PetsController.ts
  
index.ts
```js
import path from 'node:path';
import express from 'express';
import App, { IExpress } from 'express-string-controllers';

// wrap your express app
const controllersPath = path.resolve(__dirname, './custom/custom_controller');

const app: IExpress = new App(express(), controllersPath);

app.get('/pets', 'PetsController.getPets');

// Replace with your port number
app.listen(4000, () => {
  console.log('app started');
});
```

PetsController.ts
```js
class PetsController {
  static async getPets(req, res, next) {
    return res.status(200).json({
      pets: ['dog', 'cat']
    });
  }
};

export default PetsController;
```

_For more examples, check the **\_\_tests\_\_** folder._

### Using nodejs `require`

> ./index.js
```js
const path = require('path');
const express = require('express');const { App } = require("express-string-controllers");

// controller path
const cPath = path.join(__dirname, './controllers');

// init app
const app = new App(express(), cPath);

// define routes
app.get('/ban', 'PetsController.helloWorld');

app.listen(2000, () => {  console.log('server started');
});
```
> ./controllers/PetsController.js

```js
// default exports
module.exports = class PetsController {
  static async helloWorld(req, res, next) {
    return res.send('hello world');
  }
}
```
