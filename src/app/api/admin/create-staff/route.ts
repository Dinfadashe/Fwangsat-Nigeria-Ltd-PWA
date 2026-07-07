import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Guard: only a signed-in admin may call this route.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: requesterProfile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (requesterProfile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, password, fullName, phone, role } = await request.json();
  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createError || !created.user) {
    return NextResponse.json({ error: createError?.message ?? "Could not create account" }, { status: 400 });
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: fullName,
    phone: phone ?? null,
    role,
  });

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
