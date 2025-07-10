import clientPromise from "@/lib/mongodb"; // Reuse your pooled client
import type { NextAuthOptions, User, Session, JWT } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { IUser } from "@/interfaces/user";

// Extend the User type to include the role property
declare module "next-auth" {
  interface User extends IUser {}

  interface JWT {
    role?: string;
    breederId?: string | null;
  }
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const client = await clientPromise; // Use the pooled client
        const userCollection = client.db().collection("users");

        // Fetch user from DB
        const user = await userCollection.findOne({ email: credentials?.email });

        if (!user) {
          throw new Error("No user found with that email");
        }

        // Compare hashed password with the provided password
        // Note: In production, you should hash the password before storing it in the database
        if (!credentials?.password) {
          throw new Error("Password is required");
        }

        const dbPassword = user.password;

        let isValidPassword = false;

        // Can remove this check if you are sure all passwords are hashed
        if (dbPassword.startsWith("$2b$") || dbPassword.startsWith("$2a$")) {
          // Likely a bcrypt hash → use bcrypt.compare
          isValidPassword = await bcrypt.compare(credentials.password, dbPassword);
        } else {
          // Plain text fallback for legacy data
          isValidPassword = credentials.password === dbPassword;
        }

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // If everything is fine, return the user object
        // Exclude password from the returned user object for security, but ensure all required fields are present for NextAuth
        const { password, ...safeUser } = user;
        return {
          ...safeUser,
          id: user._id.toString(), // Ensure id is a string
          role: user.role || "viewer",
          breederId: user.breederId || null, // Optional breederId
        } as User;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || "viewer"; // Default to viewer if no role is provided
        token.breederId = user.breederId || null; // Optional breederId
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        (session.user as User).role = token.role || "viewer"; // Default to viewer if no role is provided
        session.user.breederId = token.breederId || null; // Optional breederId
      }
      return session;
    },
  },
}