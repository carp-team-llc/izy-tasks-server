import bcrypt from 'bcrypt';
import { UserAuth } from './dto';
import prisma from '../../utils/connection/connection';

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
            },
        });

        return { 
            statusCode: 201, 
            message: 'User created successfully', 
            userData: {
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