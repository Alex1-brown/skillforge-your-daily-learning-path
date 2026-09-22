/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as DailyRouteImport } from './routes/daily'
import { Route as DashboardRouteImport } from './routes/dashboard'
import { Route as ProfileRouteImport } from './routes/profile'
import { Route as ProgressRouteImport } from './routes/progress'
import { Route as SkillsRouteImport } from './routes/skills'
import { Route as LearnRouteImport } from './routes/learn'
const IndexRoute=IndexRouteImport.update({id:'/',path:'/',getParentRoute:()=>rootRouteImport} as any)
const DailyRoute=DailyRouteImport.update({id:'/daily',path:'/daily',getParentRoute:()=>rootRouteImport} as any)
const DashboardRoute=DashboardRouteImport.update({id:'/dashboard',path:'/dashboard',getParentRoute:()=>rootRouteImport} as any)
const ProfileRoute=ProfileRouteImport.update({id:'/profile',path:'/profile',getParentRoute:()=>rootRouteImport} as any)
const ProgressRoute=ProgressRouteImport.update({id:'/progress',path:'/progress',getParentRoute:()=>rootRouteImport} as any)
const SkillsRoute=SkillsRouteImport.update({id:'/skills',path:'/skills',getParentRoute:()=>rootRouteImport} as any)
const LearnRoute=LearnRouteImport.update({id:'/learn',path:'/learn',getParentRoute:()=>rootRouteImport} as any)
export interface FileRoutesByFullPath{'/':typeof IndexRoute;'/daily':typeof DailyRoute;'/dashboard':typeof DashboardRoute;'/profile':typeof ProfileRoute;'/progress':typeof ProgressRoute;'/skills':typeof SkillsRoute;'/learn':typeof LearnRoute}
export interface FileRoutesByTo extends FileRoutesByFullPath{}
export interface FileRoutesById{__root__:typeof rootRouteImport;'/':typeof IndexRoute;'/daily':typeof DailyRoute;'/dashboard':typeof DashboardRoute;'/profile':typeof ProfileRoute;'/progress':typeof ProgressRoute;'/skills':typeof SkillsRoute;'/learn':typeof LearnRoute}
export interface FileRouteTypes{fileRoutesByFullPath:FileRoutesByFullPath;fullPaths:'/'|'/daily'|'/dashboard'|'/profile'|'/progress'|'/skills'|'/learn';fileRoutesByTo:FileRoutesByTo;to:FileRouteTypes['fullPaths'];id:'__root__'|FileRouteTypes['fullPaths'];fileRoutesById:FileRoutesById}
declare module '@tanstack/react-router'{interface FileRoutesByPath{'/':{id:'/';path:'/';fullPath:'/';preLoaderRoute:typeof IndexRouteImport;parentRoute:typeof rootRouteImport};'/daily':{id:'/daily';path:'/daily';fullPath:'/daily';preLoaderRoute:typeof DailyRouteImport;parentRoute:typeof rootRouteImport};'/dashboard':{id:'/dashboard';path:'/dashboard';fullPath:'/dashboard';preLoaderRoute:typeof DashboardRouteImport;parentRoute:typeof rootRouteImport};'/profile':{id:'/profile';path:'/profile';fullPath:'/profile';preLoaderRoute:typeof ProfileRouteImport;parentRoute:typeof rootRouteImport};'/progress':{id:'/progress';path:'/progress';fullPath:'/progress';preLoaderRoute:typeof ProgressRouteImport;parentRoute:typeof rootRouteImport};'/skills':{id:'/skills';path:'/skills';fullPath:'/skills';preLoaderRoute:typeof SkillsRouteImport;parentRoute:typeof rootRouteImport};'/learn':{id:'/learn';path:'/learn';fullPath:'/learn';preLoaderRoute:typeof LearnRouteImport;parentRoute:typeof rootRouteImport}}}
export interface RootRouteChildren{IndexRoute:typeof IndexRoute;DailyRoute:typeof DailyRoute;DashboardRoute:typeof DashboardRoute;ProfileRoute:typeof ProfileRoute;ProgressRoute:typeof ProgressRoute;SkillsRoute:typeof SkillsRoute;LearnRoute:typeof LearnRoute}
const rootRouteChildren:RootRouteChildren={IndexRoute,DailyRoute,DashboardRoute,ProfileRoute,ProgressRoute,SkillsRoute,LearnRoute}
export const routeTree=rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type {getRouter} from './router.tsx';import type {startInstance} from './start.ts'
declare module '@tanstack/react-start'{interface Register{ssr:true;router:Awaited<ReturnType<typeof getRouter>>;config:Awaited<ReturnType<typeof startInstance.getOptions>>}}
