import path from 'path';
import fs from 'fs';
import { Express, Router } from 'express';
import { IExpress, IRouter } from './faces/types';

const loadControllers = (pathString?: string): Map<string, Function> => {
  let initPath = require.main?.filename as string;
  let dir = path.dirname(initPath);
  let cPath = `${dir}${path.sep}controllers${path.sep}`;
  const controllers = new Map<string, Function>();

  if (pathString) {
    // Get the controllers path
    cPath = path.resolve(pathString); 
    if (!fs.existsSync(cPath)) {
      // Throw error
      throw new Error('Controllers folder not found');
    }
  }

  if (!dir) {
    throw new Error('Controllers folder not found');
  }

  // Read all .js or .ts files in path
  const files = fs.readdirSync(cPath);
  for (const file of files) {
    // import the files and the default class exports
    const crl = require(path.resolve(cPath, file));

    if (!crl || !crl.default) {
      continue;
    }
    
    const def = crl.default;
    const controller = def.name;
    const methods = Object.getOwnPropertyNames(def).filter(i => typeof def[i] === 'function');
    
    for (const method of methods) {
      controllers.set(`${controller}.${method}`, def[method]);
    }
  }

  return controllers;
};

export class App {
  public express: Express | Router
  private _controllers: Map<string, Function>
  private _whitelist: string[]

  constructor(express: Express | Router, controllersPath?: string) {
    this.express = express;
    this._controllers = loadControllers(controllersPath);
    this._whitelist = ['listen', 'get', 'post', 'put', 'patch', 'delete', 'use'];
    Object.getOwnPropertyNames(express).forEach((key) => {
      try {
        if (!this._whitelist.includes(key)) {
          // @ts-ignore
          this[key] = express[key]
        }
      } catch (e) {}
    })

    this._whitelist.filter(i => i !== 'listen').forEach((method) => {
      // @ts-ignore
      this[method] = (...args: any) => {
        const $args = [];
        for (const arg of args) {
          if (typeof arg === 'string') {
            const conFunc = this._controllers.get(arg);
            if (conFunc) {
              $args.push(conFunc);
            } else {
              $args.push(arg);
            }
          } else {
            $args.push(arg);
          }
        }

        // @ts-ignore
        return this.express[method](...$args)
      }
    })
  }

  public listen(...args: any) {
    // @ts-ignore
    return this.express.listen(...args)
  }
}

export default App;
export { IExpress, IRouter };