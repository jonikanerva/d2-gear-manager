import { NextFunction, Request, Response } from 'express'
import html from '../templates/html'

export const getRoot = (
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.send(html())
}
