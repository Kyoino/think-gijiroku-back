import { RequestHandler } from 'express';
import yaml from 'yamljs';

export const openAPIJSONMiddleware = (): RequestHandler => (
  req,
  res,
  next
): void => {
  res.setHeader('Content-Type', 'application/json');
  res.send(yaml.load('./src/routes/OPENAPI.yaml'));
  next();
};
