import supertest from 'supertest';
import express from 'express';
import App, { IExpress } from '../src';

const app: IExpress = new App(express()) as any;
const port = Math.floor(Math.random() * (9000 - 5000 + 1) + 5000);
const url = `http://localhost:${port}`;
let listener: any;
const request = supertest(url);

beforeAll(() => {
  listener = app.listen(port, () => {
    console.log(`App listening on ${port}`);
  });
});

afterAll(() => {
  listener.close();
});

describe('EXPRESS REQUESTS', () => {
  it('GET /test', async () => {
    app.get('/test', 'TestController.helloWorld');
    const res = await request.get('/test');
    expect(res.body.message).toBe('hello world');
  });

  it('GET /test/:name', async () => {
    app.get('/test/:name', 'TestController.getNameContent');
    const res = await request.get('/test/fuad');
    expect(res.body.name).toBe('fuad');
  });

  it('POST /test/:name', async () => {
    app.post('/test/:name', 'TestController.createName');
    const res = await request.post('/test/chinwe');
    expect(res.body.name).toBe('chinwe');
  });

  it('PATCH /test/:name', async () => {
    app.patch('/test/:name', 'TestController.renameName');
    const res = await request.patch('/test/bola');
    expect(res.body.name).toBe('bola');
  });

  it('PUT /test/:name', async () => {
    app.put('/test/:name', 'TestController.appendName');
    const res = await request.put('/test/tope');
    expect(res.body.name).toBe('tope');
  });

  it('DELETE /test/:name', async () => {
    app.delete('/test/:name', 'TestController.deleteName');
    const res = await request.delete('/test/kelvin');
    expect(res.body.name).toBe('kelvin');
  });
});

describe('EXPRESS MIDDLE WARES', () => {
  // Test should append hello to name
  it('GET /test/middle-ware/:name', async () => {
    app.get('/test/middle-ware/:name', 'TestController.middleWare', 'TestController.getNameContent');
    const res = await request.get('/test/middle-ware/kelvin');
    expect(res.body.name).toBe('hello kelvin');
  });
});
