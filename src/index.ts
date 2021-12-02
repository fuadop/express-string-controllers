import path from 'path';
import fs from 'fs';
// import callerPath from 'caller-path';
import { Express, Router } from 'express';

const loadControllers = (pathString?: string): Map<String, Function> => {
  let initPath = require.main?.filename as string;
  // let initPath = callerPath() as string;
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

const app = (express: Express, controllersPath?: string): Express => {
  const controllers = loadControllers(controllersPath);

  const wrapped = { ...express };

  const funcs = ['use', 'get', 'post', 'patch', 'put', 'delete', 'head'];

  // Create objects for all possible express | router functions 
  for (const func of funcs) {
    // @ts-ignore
    wrapped[func] = (...args) => {
      const newArgs = [];
      // check for controller strings
      for (const arg of args) {
        if (typeof arg === 'string') {
          const conFunc = controllers.get(arg);
          if (conFunc) {
            newArgs.push(conFunc);
          } else {
            newArgs.push(arg);
          }
        } else {
          newArgs.push(arg);
        }
      }

      // @ts-ignore
      return express[func](...newArgs);
    }
  }

  return wrapped as Express;
};

export default app;
