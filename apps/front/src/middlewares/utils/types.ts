// middleware/types.ts

import { NextMiddleware } from 'next/server'

type AddParameters<
    TFunction extends (...args: any) => any,
    TParameters extends [...args: any]
> = (
    ...args: [...Parameters<TFunction>, ...TParameters]
) => ReturnType<TFunction>

export type CustomNextMiddleware = AddParameters<
    NextMiddleware,
    [key?: number | string]
>
export type MiddlewareFactory = (
    middleware: CustomNextMiddleware
) => CustomNextMiddleware
export type Matcher = (string | RegExp)[] | Record<string, string | RegExp>
