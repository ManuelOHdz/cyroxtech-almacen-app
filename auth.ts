import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/lib/db"
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getAccountByUserId } from "@/actions/account";

export const { 
    handlers: { GET, POST }, 
    auth,
    signIn,
    signOut, 
  } = NextAuth({
    pages: {
      signIn: "/auth/login",
      error: "/auth/error",
    },
    events: {
      async linkAccount({ user }) {
        await db.user.update({
          where: { id: user.id },
          data: { emailVerified: new Date() }
        })
      }
    },
    callbacks: {
      async signIn({ user, account }) {
        // Permite OAuth sin verificacion de Email
        if (account?.provider !== "credentials") return true;

        const existingUser = await getUserById(user.id as string);

        //Previene iniciar sesion sin email verification
        if(!existingUser?.emailVerified) return false;

        if(!existingUser?.estado) return false;

        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
          
          if (!twoFactorConfirmation) return false;

          //Eliminar two factor confirmation para el siguient inicio de sesion
          await db.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          });
        }
        

        return true;
      },
      async session({ token, session }) {
        if(token.sub && session.user){
          session.user.id = token.sub;
        }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if(session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      const existingAccount = await getAccountByUserId(
        existingUser.id
      )

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      token.image = existingUser.image;

      return token;
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});