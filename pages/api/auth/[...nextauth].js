import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import authConnect from '../../../lib/auth-mongodb';
import User from '../../../models/User';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        type: { label: "User Type", type: "text" }
      },
      async authorize(credentials) {
        await authConnect();

        const user = await User.findOne({ 
          email: credentials.email 
        });

        if (!user) {
          throw new Error('No user found');
        }

        const isValid = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isValid) {
          throw new Error('Invalid password');
        }

        if (credentials.type !== user.role) {
          throw new Error('Invalid user type');
        }

        return { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
});