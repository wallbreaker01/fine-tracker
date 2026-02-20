import type { SignInInput, SignUpInput,} from "@/lib/validations/formValidation";

type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthResult = {
  success: boolean;
  message: string;
};

declare global {
  var __fineTrackerMockUsers: MockUser[] | undefined;
}

const mockAuthConstants = {
  delays: {
    signInMs: 500,
    signUpMs: 700,
  },
  demoUser: {
    id: "demo-user",
    name: "Demo User",
    email: "demo@finetracker.com",
    password: "Password123",
  },
  messages: {
    invalidCredentials: "Invalid email or password",
    emailExists: "An account with this email already exists",
    accountCreated: "Account created successfully",
  },
} as const;

const mockUsers =
  globalThis.__fineTrackerMockUsers ??
  (globalThis.__fineTrackerMockUsers = [{ ...mockAuthConstants.demoUser }]);

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function signInMock(data: SignInInput): Promise<AuthResult> {
  await pause(mockAuthConstants.delays.signInMs);

  const user = mockUsers.find(
    (item) => item.email.toLowerCase() === data.email.toLowerCase().trim(),
  );

  if (!user || user.password !== data.password) {
    return {
      success: false,
      message: mockAuthConstants.messages.invalidCredentials,
    };
  }

  return { success: true, message: `Welcome back, ${user.name}` };
}

export async function signUpMock(data: SignUpInput): Promise<AuthResult> {
  await pause(mockAuthConstants.delays.signUpMs);

  const existing = mockUsers.find(
    (item) => item.email.toLowerCase() === data.email.toLowerCase().trim(),
  );

  if (existing) {
    return { success: false, message: mockAuthConstants.messages.emailExists };
  }

  mockUsers.push({
    id: `user-${Date.now()}`,
    name: data.name.trim(),
    email: data.email.trim(),
    password: data.password,
  });

  return { success: true, message: mockAuthConstants.messages.accountCreated };
}
