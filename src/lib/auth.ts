import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

type JWTPayload = {
  iss: string;
  iat: number;
  nbf: number;
  exp: number;
  data: {
    user: {
      id: string;
    };
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            `${process.env.WOOCOMMERCE_URL}/wp-json/jwt-auth/v1/token`,
            { username: credentials?.email, password: credentials?.password }
          );
          if (data?.token) {
            const decoded = jwtDecode<JWTPayload>(data.token);

            const userId = decoded.data.user.id;

            return {
              id: userId,
              email: data.user_email,
              name: data.user_display_name,
              accessToken: data.token,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken?: string }).accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        accessToken: token.accessToken as string,
      } as typeof session.user & { id: string; accessToken: string };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
