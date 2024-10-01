import { useSession, signIn } from "next-auth/react";

export const useCurrentUser = () => {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn();
        },
    });

    return session?.user;
};
