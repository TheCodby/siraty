import NextAuth from "next-auth";
import LinkedIn from "next-auth/providers/linkedin";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Extend the session and JWT types to include the access token
declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],

  // Use JWT strategy instead of database sessions for now
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, account }) {
      // Store the access token in the JWT
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Make the access token available in the session
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});
