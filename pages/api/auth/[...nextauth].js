import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB } from '../../../lib/mongodb';
import { compare } from 'bcryptjs';

export default NextAuth({
  adapter: MongoDBAdapter({
    db: async () => {
      const connection = await connectDB();
      return connection.getDatabase();
    }
  }),

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const connection = await connectDB();
        const db = await connection.getDatabase();
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ 
          email: credentials.email 
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password, 
          user.password
        );

        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    })
  ],

  pages: {
    signIn: '/',
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    }
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET
});