import { getServerSession } from 'next-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.error('❌ Missing credentials');
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { username: credentials.username },
            include: { admin: true, doctor: true, patient: true },
          });

          if (!user) {
            console.error('❌ User not found:', credentials.username);
            return null;
          }

          if (user.status !== 'ACTIVE') {
            console.error('❌ User not active:', credentials.username, 'status:', user.status);
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);
          if (!passwordMatch) {
            console.error('❌ Password mismatch for user:', credentials.username);
            return null;
          }

          let name = '';
          let profileId = 0;
          let clinicId = null;
          if (user.admin) { name = user.admin.name; profileId = user.admin.adminId; clinicId = user.admin.clinicId; }
          else if (user.doctor) { name = user.doctor.fullName; profileId = user.doctor.doctorId; clinicId = user.doctor.clinicId; }
          else if (user.patient) { name = user.patient.fullName; profileId = user.patient.patientId; }

          console.log('✓ Login successful:', { username: credentials.username, role: user.role });

          return {
            id: String(user.userId),
            name,
            email: user.patient?.email || user.admin?.email || '',
            username: user.username,
            role: user.role,
            profileId,
            clinicId,
          };
        } catch (err) {
          console.error('❌ Authorization error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        // Allow credentials login normally
        if (account?.provider === 'credentials') {
          console.log('✓ Credentials login allowed');
          return true;
        }

        // For Google sign-in: check if this Google email is already linked to a user
        if (account?.provider === 'google' && user.email) {
          const existingPatient = await prisma.patient.findUnique({
            where: { email: user.email },
            include: { user: true },
          });

          // If found and active, allow sign in
          if (existingPatient?.user && existingPatient.user.status === 'ACTIVE') {
            // Store googleId if not already stored
            if (!existingPatient.googleId) {
              await prisma.patient.update({
                where: { patientId: existingPatient.patientId },
                data: { googleId: account.providerAccountId },
              });
            }
            console.log('✓ Google login allowed for existing patient');
            return true;
          }

          // No account linked — redirect to register with Google info pre-filled
          console.log('ℹ️ New Google account, redirecting to register');
          return `/register?googleEmail=${encodeURIComponent(user.email)}&googleName=${encodeURIComponent(user.name || '')}&googleId=${encodeURIComponent(account.providerAccountId)}`;
        }

        return true;
      } catch (err) {
        console.error('❌ SignIn callback error:', err);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role;
        token.username = (user as any).username;
        token.profileId = (user as any).profileId;
        token.clinicId = (user as any).clinicId;
      }

      // For Google OAuth users, fetch their DB record to get role etc.
      if (account?.provider === 'google' && token.email) {
        const patient = await prisma.patient.findUnique({
          where: { email: token.email as string },
          include: { user: true },
        });
        if (patient?.user) {
          token.role = patient.user.role;
          token.username = patient.user.username;
          token.profileId = patient.patientId;
          token.sub = String(patient.user.userId);
        }
      }

      return token;
    },
    async session({ session, token }) {
      try {
        if (token) {
          (session.user as any).id = token.sub;
          (session.user as any).role = token.role;
          (session.user as any).username = token.username;
          (session.user as any).profileId = token.profileId;
          (session.user as any).clinicId = token.clinicId;
        }
        console.log('✓ Session retrieved:', { 
          username: (session.user as any).username, 
          role: (session.user as any).role 
        });
        return session;
      } catch (err) {
        console.error('❌ Session callback error:', err);
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function requireAuth(allowedRoles?: string[]) {
  const session = await getSession();
  if (!session) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null };
  }
  const role = (session.user as any).role;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null };
  }
  return { error: null, session };
}