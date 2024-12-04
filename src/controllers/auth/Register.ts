import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { UserAuth } from './dto';
import prisma from '../../utils/connection/connection';
import { SendMailSystem } from '../mail/SendMail';
import { ActivateAccountEmailForm } from '../../constant/MailForm';

const userRegister = async ({ username, email, password, phone }: UserAuth) => {
    try {
        if (!username || !email || !password || !phone) {
            return { statusCode: 400, message: "Information is not complete, please enter complete information before trying again!" };
        }

        const isUserAlreadyExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email },
                ],
            },
        });
        if (isUserAlreadyExists) {
            return { statusCode: 400, message: "User already exists!" };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
                phone,
                role: 'member',
                isAdmin: false,
                verificationToken: crypto.randomBytes(32).toString('hex')
            },
        });

        const verificationLink = `${process.env.IP_HOST_SSL}/api/v1/auth/authentication/verify_email?token=${newUser.verificationToken}`;

        const sendActivateMail = await SendMailSystem({
            to: email,
            subject: "Activate your account!",
            text: "Hi, we are Carp Team!",
            content: verificationLink,
            html: ActivateAccountEmailForm(email, verificationLink)
        })

        return { 
            statusCode: sendActivateMail.statusCode, 
            message: 'User created successfully', 
            notification: 'We just sent you an email to verify your account, please check your email to verify your account!',
            data: {
                username: newUser.username,
                email: newUser.email,
                phone: newUser.phone,
            }
        };

    } catch (error) {

        console.error('Error in userRegister:', error);
        return { statusCode: 500, message: "Internal Server Error" };

    }
};

export default userRegister;