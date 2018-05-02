import 'reflect-metadata';
import { ExpressServer, Log, TYPES } from 'typespeed';
import './controllers/user.controller';
import './controllers/policy.controller';
import { bootstrap, container } from './bootstrap';
import { mockup } from './mockup';

bootstrap();
const port = process.env['PORT'] || process.env['port'] || 4000;
const server: ExpressServer = new ExpressServer();
const app: any = server.useDefaultAuth().setPort(port).build().start();
mockup();
const logger: Log = container.get<Log>(TYPES.Log);
logger.info(`Server started on port ${port}`);
