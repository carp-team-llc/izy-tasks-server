
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/connection/connection';
import { UserLogin } from './dto';

const userLogin = async ({email, password}: UserLogin) => {
    try {

        if (!email || !password) {
            return {statusCode: 400, message: "Information is not complete, please enter complete information before trying again!"}
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { statusCode: 404, message: "User not found" };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { statusCode: 401, message: "Password is incorrect" };
        }

        const token = jwt.sign({ 
            userId: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isAdmin: user.isAdmin,
            isVerify: user.isVerify
        }, process.env.ACCESS_TOKEN, { expiresIn: '1h' }); 

        return { 
            statusCode: 200, 
            message: "Login successful", 
            accessToken: token,
            userData: {
                email: user.email,
                isAdmin: user.isAdmin,
                createdAt: user.createdAt,
            }
        };

    } catch (error) {

        console.error('Error in userLogin:', error);
        return {statusCode: 500, message: "Bad Request!"}

    }
}

export default userLogin;