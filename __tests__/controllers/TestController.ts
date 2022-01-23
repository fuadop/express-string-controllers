import { Request, Response } from 'express';

class TestController {
  static async helloWorld(_: Request, res: Response) {
    return res.status(200).json({
      message: 'hello world'
    });
  }

  static async getNameContent(req: Request, res: Response) {
    const { name } = req.params;
    return res.status(201).json({
      name
    });
  }

  static async createName(req: Request, res: Response) {
    const { name } = req.params;
    return res.status(201).json({
      name
    });
  }

  static async renameName(req: Request, res: Response) {
    const { name } = req.params;
    return res.status(201).json({
      name
    });
  }

  static async appendName(req: Request, res: Response) {
    const { name } = req.params;
    return res.status(201).json({
      name
    });
  }

  static async deleteName(req: Request, res: Response) {
    const { name } = req.params;
    return res.status(201).json({
      name
    });
  }
  
  static async middleWare(req: Request, res: Response, next: any) {
    const { name } = req.params;

    req.params.name = `hello ${name}`;
    next();
  }
}

export default TestController;
