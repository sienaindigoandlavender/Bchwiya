// Creates (or updates) the two Bchwiya users and sets their roles.
// Usage: pnpm seed   (reads .env.local / .env, or the process environment)
import { createClient } from "@supabase/supabase-js";
import type { Database, Role } from "@/lib/supabase/types";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // File absent: rely on the process environment.
  }
}

function env(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing env var ${name}`);
    process.exit(1);
  }
  return v;
}

const supabase = createClient<Database>(
  env("NEXT_PUBLIC_SUPABASE_URL"),
  env("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const people: { email: string; role: Role; displayName: string }[] = [
  { email: env("ADMIN_EMAIL"), role: "admin", displayName: "Jacqueline" },
  { email: env("LEARNER_EMAIL"), role: "learner", displayName: "Zahra" },
];

async function findUserId(email: string): Promise<string | null> {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (hit) return hit.id;
    if (data.users.length < 200) return null;
  }
}

async function main() {
  for (const p of people) {
    let id = await findUserId(p.email);
    if (!id) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: p.email,
        email_confirm: true,
      });
      if (error) throw error;
      id = data.user.id;
      console.log(`Created auth user ${p.email}`);
    }
    const { error } = await supabase
      .from("bchwiya_profiles")
      .upsert({ id, role: p.role, display_name: p.displayName });
    if (error) throw error;
    console.log(`✓ ${p.email} → ${p.role}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
