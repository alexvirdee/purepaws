import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

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

        if (user && user.password === credentials?.password) {
            // Never store plain passwords in production!
            return { id: user._id.toString(), email: user.email };
        } else {
            return null;
        }
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