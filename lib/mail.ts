import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
) => {
    await resend.emails.send({
        from: "cyroxtech@resend.dev",
        to: "manuelhdz0116@outlook.com",
        subject: "Codigo de verificacion",
        html: `<p>Codigo de verifacion es: ${token}</p>`
    });
}

export const sendPasswordResetEmail = async (
    email: string,
    token: string,
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`

    await resend.emails.send({
        from: "cyroxtech@resend.dev",
        to: "manuelhdz0116@outlook.com",
        subject: "Cambia tu contraseña",
        html: `<p>Click <a href="${resetLink}">aqui</a> para cambiar contraseña</p>`
    });
};

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    await resend.emails.send({
        from: "cyroxtech@resend.dev",
        to: "manuelhdz0116@outlook.com",
        subject: "Confirma tu correo",
        html: `<p>Click <a href="${confirmLink}">aqui</a> para confirmar email</p>`
    });
};