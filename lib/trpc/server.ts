import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./routers";
import { auth } from "@/lib/auth";

export const createContext = async ({ req }: { req: Request }) => {
  const session = await auth.api.getSession({ headers: req.headers });
  return { session };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

export const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext({ req }),
  });
