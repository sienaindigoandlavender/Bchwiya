import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

const PUBLIC_PATHS = ["/connexion", "/auth"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  // No database yet: everything lands on /connexion, which explains it.
  if (!isSupabaseConfigured()) {
    if (isPublic) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet) => {
          for (const { name, value } of toSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of toSet) response.cookies.set(name, value, options);
        },
      },
    },
  );

  // Refreshes the session cookie. Do not put code between createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const redirectTo = (path: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = search;
    const res = NextResponse.redirect(url);
    for (const c of response.cookies.getAll()) res.cookies.set(c);
    return res;
  };

  if (!user) return isPublic ? response : redirectTo("/connexion");
  if (pathname.startsWith("/auth/")) return response;

  // The auth users table is shared with another app: only users with a
  // Bchwiya profile get in. Anyone else is signed out.
  const { data: profile } = await supabase
    .from("bchwiya_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (!profile) {
    await supabase.auth.signOut();
    return pathname === "/connexion" ? response : redirectTo("/connexion", "?erreur=acces");
  }

  if (pathname === "/connexion") return redirectTo("/");
  if ((pathname === "/admin" || pathname.startsWith("/admin/")) && profile.role !== "admin") {
    return redirectTo("/");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
