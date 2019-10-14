import { GraphqlMiddleware, Resolver } from "../types/graphql-util";

export const createMiddleware =
  (middleware: GraphqlMiddleware, resolver: Resolver) =>
    (parent: any, args: any, context: any, info: any) =>
      middleware(resolver, parent, args, context, info);
