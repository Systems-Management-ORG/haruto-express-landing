import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Sends "/" to the visitor's language and remembers their choice in a cookie.
export default createMiddleware(routing);

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
