import {
  Bell,
  Calendar,
  FileText,
  Home,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

export const navItems: { title: string; href: string }[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Calender", href: "/calender" },
  { title: "Fines", href: "/fines" },
  { title: "Notifications", href: "/notifications" },
  { title: "Party", href: "/party" },
  { title: "Profile", href: "/profile" },
];

export const iconMap: Record<string, LucideIcon> = {
  "/": Home,
  "/calender": Calendar,
  "/fines": FileText,
  "/notifications": Bell,
  "/party": Users,
  "/profile": User,
};

export const authRoutes = {
  signIn: "/",
  signUp: "/sign-up",
  dashboard: "/dashboard",
} as const;

export const authValidationMessages = {
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  passwordRequired: "Password is required",
  nameRequired: "Name is required",
  confirmPasswordRequired: "Confirm password is required",
  passwordMismatch: "Passwords do not match",
} as const;

export const mockAuthConstants = {
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
