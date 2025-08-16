import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';
import { compare } from 'bcryptjs';

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Add logic to verify credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const client = await clientPromise;
        const db = client.db('edusphere');
        
        // Find user by email
        const user = await db.collection('users').findOne({
          email: credentials.email.toLowerCase(),
        });

        if (!user) {
          throw new Error('No user found with this email');
        }

        // Check password
        const isValid = await compare(credentials.password, user.password);
        
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        return {
          ...userWithoutPassword,
          id: user._id.toString(),
        };
      },
    }),
    // Add more providers here (Google, Microsoft, etc.)
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}
