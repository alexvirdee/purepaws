import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

const client = await MongoClient.connect(process.env.MONGODB_URI!);
const userCollection = client.db().collection("users");

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
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
        console.log('credentials password:', credentials.password);
        console.log('user:', user);
        console.log('user password:', user.password);

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
        return { id: user._id.toString(), email: user.email };

      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
  },
}