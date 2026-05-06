
import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import bcrypt from 'bcrypt';

const formatUserName = (firstName?: string | null, lastName?: string | null) => {
  const fullName = [firstName, lastName]
    .map((name) => name?.trim())
    .filter(Boolean)
    .join(' ');

  return fullName || null;
};

declare module 'next-auth' {
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

// Export v5 handlers and helpers
export const {
  auth,
  signIn,
  signOut,
  handlers,
  unstable_update: updateSession,
} = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'john@foo.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Type guard for credentials
        if (
          !credentials ||
          typeof credentials.email !== 'string' ||
          typeof credentials.password !== 'string'
        ) {
          return null;
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || typeof user.password !== 'string') return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        // Return user object for session
        return {
          id: user.id.toString(),
          email: user.email,
          name: formatUserName(user.firstName, user.lastName) ?? user.email,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
  },
  callbacks: {
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          email: typeof token.email === 'string' ? token.email : session.user.email,
          name: typeof token.name === 'string' ? token.name : session.user.name,
          role: (token as { role?: string }).role,
        },
      };
    },
    jwt({ token, user, trigger, session }) {
      // user is type: { id?: string; email?: string; name?: string; role?: string }
      if (user && typeof (user as { role?: string }).role === 'string') {
        token.role = (user as { role?: string }).role;
      }
      if (trigger === 'update' && session?.user) {
        if (typeof session.user.name === 'string') {
          token.name = session.user.name;
        }
      }
      return token;
    },
  },
});
