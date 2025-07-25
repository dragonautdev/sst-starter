/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from './routes/__root'
import { Route as AppRouteImport } from './routes/_app'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AppHelpRouteImport } from './routes/_app/help'
import { Route as AppBillingRouteImport } from './routes/_app/billing'
import { Route as AppAccountRouteImport } from './routes/_app/account'
import { Route as AppDashboardIndexRouteImport } from './routes/_app/dashboard/index'

const AppRoute = AppRouteImport.update({
  id: '/_app',
  getParentRoute: () => rootRouteImport,
} as any)
const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)
const AppHelpRoute = AppHelpRouteImport.update({
  id: '/help',
  path: '/help',
  getParentRoute: () => AppRoute,
} as any)
const AppBillingRoute = AppBillingRouteImport.update({
  id: '/billing',
  path: '/billing',
  getParentRoute: () => AppRoute,
} as any)
const AppAccountRoute = AppAccountRouteImport.update({
  id: '/account',
  path: '/account',
  getParentRoute: () => AppRoute,
} as any)

const AppDashboardIndexRoute = AppDashboardIndexRouteImport.update({
  id: '/dashboard/',
  path: '/dashboard/',
  getParentRoute: () => AppRoute,
} as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/account': typeof AppAccountRoute
  '/billing': typeof AppBillingRoute
  '/help': typeof AppHelpRoute
  '/dashboard': typeof AppDashboardIndexRoute
}
export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/account': typeof AppAccountRoute
  '/billing': typeof AppBillingRoute
  '/help': typeof AppHelpRoute
  '/dashboard': typeof AppDashboardIndexRoute
}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/_app': typeof AppRouteWithChildren
  '/_app/account': typeof AppAccountRoute
  '/_app/billing': typeof AppBillingRoute
  '/_app/help': typeof AppHelpRoute
  '/_app/dashboard/': typeof AppDashboardIndexRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/account'
    | '/billing'
    | '/help'
    | '/dashboard'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/account'
    | '/billing'
    | '/help'
    | '/dashboard'
  id:
    | '__root__'
    | '/'
    | '/_app'
    | '/_app/account'
    | '/_app/billing'
    | '/_app/help'
    | '/_app/dashboard/'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  AppRoute: typeof AppRouteWithChildren
}

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/_app': {
      id: '/_app'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof AppRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexRouteImport
      parentRoute: typeof rootRouteImport
    }
    '/_app/help': {
      id: '/_app/help'
      path: '/help'
      fullPath: '/help'
      preLoaderRoute: typeof AppHelpRouteImport
      parentRoute: typeof AppRoute
    }
    '/_app/billing': {
      id: '/_app/billing'
      path: '/billing'
      fullPath: '/billing'
      preLoaderRoute: typeof AppBillingRouteImport
      parentRoute: typeof AppRoute
    }
    '/_app/account': {
      id: '/_app/account'
      path: '/account'
      fullPath: '/account'
      preLoaderRoute: typeof AppAccountRouteImport
      parentRoute: typeof AppRoute
    }
    '/_app/dashboard/': {
      id: '/_app/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof AppDashboardIndexRouteImport
      parentRoute: typeof AppRoute
    }
  }
}


interface AppRouteChildren {
  AppAccountRoute: typeof AppAccountRoute
  AppBillingRoute: typeof AppBillingRoute
  AppHelpRoute: typeof AppHelpRoute
  AppDashboardIndexRoute: typeof AppDashboardIndexRoute
}

const AppRouteChildren: AppRouteChildren = {
  AppAccountRoute: AppAccountRoute,
  AppBillingRoute: AppBillingRoute,
  AppHelpRoute: AppHelpRoute,
  AppDashboardIndexRoute: AppDashboardIndexRoute,
}

const AppRouteWithChildren = AppRoute._addFileChildren(AppRouteChildren)

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  AppRoute: AppRouteWithChildren,
}
export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()
