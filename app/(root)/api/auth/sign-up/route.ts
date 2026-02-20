import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { db, ensureUsersTable } from "@/lib/db";
import { signUpSchema } from "@/lib/validations/formValidation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid sign-up data" },
        { status: 400 },
      );
    }

    await ensureUsersTable();

    const email = parsed.data.email.trim().toLowerCase();
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email,]);

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        },
        { status: 409 },
      );
    }

    const passwordHash = hashPassword(parsed.data.password);
    await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)",
      [parsed.data.name.trim(), email, passwordHash],
    );

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unable to create account right now" },
      { status: 500 },
    );
  }
}
