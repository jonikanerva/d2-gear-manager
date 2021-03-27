import { NextFunction, Request, Response } from 'express'

import html from '../templates/html'

export const getRoot = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const url = req.route.path || '/'
  const response = html(url)

  res.send(response)
}
