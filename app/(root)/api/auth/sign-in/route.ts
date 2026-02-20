import { NextResponse } from "next/server";

import { verifyPassword } from "@/lib/auth/password";
import { db, ensureUsersTable } from "@/lib/db";
import { signInSchema } from "@/lib/validations/formValidation";

type UserRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid sign-in data" },
        { status: 400 },
      );
    }

    await ensureUsersTable();

    const email = parsed.data.email.trim().toLowerCase();
    const result = await db.query<UserRow>(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [email],
    );

    const user = result.rows[0];
    if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${user.name}`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to sign in right now" },
      { status: 500 },
    );
  }
}
