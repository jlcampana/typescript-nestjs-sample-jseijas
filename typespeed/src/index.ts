/**
 * Index of the typespeed components
 */
import { Container, inject, injectable, injectable as Component } from 'inversify';
import { makeLoggerMiddleware } from 'inversify-logger-middleware';
import { AuthProviderDefault, AuthServiceMemory, AuthUserModel, PrincipalDefault, RoleMappingModel } from './auth/auth-entities';
import { AuthProvider, AuthService, AuthUser, Principal, RoleMapping } from './auth/auth-interfaces';
import { all, controller, controller as Controller, cookies, httpDelete, httpDelete as Delete, httpGet, httpGet as Get, 
  httpHead, httpHead as Head, httpMethod, httpPatch, httpPatch as Patch, httpPost, httpPost as Post, httpPut, httpPut as Put,
  injectHttpContext, injectHttpContext as HttpContext, injectHttpUser, injectHttpUser as HttpUser, next, next as Next,
  queryParam, queryParam as QueryParam, request, request as Request, requestBody, requestBody as Body, requestHeaders,
  requestHeaders as Headers, requestParam, requestParam as Param, response, response as Response } from './decorators/express/express-decorator';
import { logClass, logDecoratorConfiguration, logMethod } from './decorators/log/log-decorator';
import { BaseHttpController } from './express/base-http-controller';
import { BaseMiddleware } from './express/base-middleware';
import { interfaces as expressInterfaces } from './express/interfaces';
import { ExpressServer } from './express/server';
import { containerManager } from './ioc/container-manager';
import { ConsoleLogger } from './logger/console-logger';
import { Log, LogLevel } from './logger/log';
import { Logger } from './logger/logger';
import { PinoLogger } from './logger/pino-logger';
import { TYPES } from './types';

export {
  inject,
  injectable,
  Component,
  Container,
  containerManager,
  makeLoggerMiddleware,
  Log,
  LogLevel,
  Logger,
  ConsoleLogger,
  PinoLogger,
  TYPES,
  logDecoratorConfiguration,
  logClass,
  logMethod,
  AuthProvider,
  AuthService,
  AuthUser,
  Principal,
  RoleMapping,
  AuthProviderDefault,
  AuthServiceMemory,
  AuthUserModel,
  PrincipalDefault,
  RoleMappingModel,
  expressInterfaces,
  BaseMiddleware,
  BaseHttpController,
  all,
  controller,
  Controller,
  cookies,
  httpDelete,
  Delete,
  httpGet,
  Get,
  httpHead,
  Head,
  httpMethod,
  httpPatch,
  Patch,
  httpPost,
  Post,
  httpPut,
  Put,
  injectHttpContext,
  HttpContext,
  injectHttpUser,
  HttpUser,
  next,
  Next,
  queryParam,
  QueryParam,
  request,
  Request,
  requestBody,
  Body,
  requestHeaders,
  Headers,
  requestParam,
  Param,
  response,
  Response,
  ExpressServer
};
