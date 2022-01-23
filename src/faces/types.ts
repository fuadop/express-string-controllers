import { Request, Response } from 'express';

export interface IExpress {
  get: (...args: any[]) => any;
  post: (...args: any[]) => any;
  put: (...args: any[]) => any;
  patch: (...args: any[]) => any;
  use: (...args: any[]) => any;
  delete: (...args: any[]) => any;
  request: Request;
  response: Response;
  listen: (port: number, cb: () => any) => any;
};

export interface IRouter {
  get: (...args: any[]) => any;
  post: (...args: any[]) => any;
  put: (...args: any[]) => any;
  patch: (...args: any[]) => any;
  use: (...args: any[]) => any;
  delete: (...args: any[]) => any;
};
