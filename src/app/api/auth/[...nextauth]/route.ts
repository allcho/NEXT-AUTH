import AuthService from "@/services/auth.services";
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'


async function refreshAccessToken(refreshToken:any) {
  try {
    console.warn("trying to post to refresh token");

    const refreshedTokens = await AuthService.refresh(refreshToken.refreshToken);

    if (!refreshedTokens || !refreshedTokens.result) {
      console.warn("No refreshed tokens");
      throw refreshedTokens;
    }

    console.warn("Refreshed tokens successfully");
    return {
      ...refreshToken,
      accessToken: refreshedTokens.result.accessToken,
      accessTokenExpires: Date.now() + refreshedTokens.result.expires,
      refreshToken: refreshedTokens.result.refreshToken,
    };
  } catch (error) {
    console.warn("Error refreshing token", error);
    return {
      ...refreshToken,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'Login',
      type: 'credentials',
      credentials: {
        email: { label: 'email', type: 'email', required: true },
        password: { label: 'password', type: 'password', required: true },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) throw new Error("no credentials to log in as");
        
          const userTokens = await AuthService.login(credentials.email, credentials?.password);

          const user = {
            email: credentials.email,
            accessToken: userTokens.result.accessToken,
            accessTokenExpires: Date.now() + userTokens.result.expires,
            refreshToken: userTokens.result.refreshToken,
          };
          console.log(user)
          return user as any;
        } catch (ignored) {
          return null;
        }
      }
    }),
    
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        console.warn("JWT callback", { token, user, account });
        return {
          ...token,
          ...user,
        };
      }

      if (token.accessTokenExpires &&  Date.now() > Number(token.accessTokenExpires)) {
        console.warn("Token is expired. Getting a new");
        return refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      console.warn("Calling async session", session, token);
      session.user = {
        ...session.user,
        ...token,
      };

      return session;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }


