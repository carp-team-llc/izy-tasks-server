
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/connection/connection';
import { UserLogin } from './dto';
import { EnumData } from '../../constant/enumData';

const userLogin = async ({email, password}: UserLogin) => {
    try {

        if (!email || !password) {
            return {statusCode: 400, message: "Information is not complete, please enter complete information before trying again!"}
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { 
                statusCode: 404,
                errorCode: EnumData.ErrorCode.NotFound.code,
                errorName: EnumData.ErrorCode.NotFound.name,
                errorEngName: EnumData.ErrorCode.NotFound.engName,
                message: "User not found" 
            };
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { 
                statusCode: 401,
                errorCode: EnumData.ErrorCode.PasswordIncorrect.code,
                errorName: EnumData.ErrorCode.PasswordIncorrect.name,
                errorEngName: EnumData.ErrorCode.PasswordIncorrect.engName,
                message: "Password is incorrect" 
            };
        }

        if (!user?.isVerify) {
            return {
                statusCode: 401,
                errorCode: EnumData.ErrorCode.NonVerify.code,
                errorName: EnumData.ErrorCode.NonVerify.name,
                errorEngName: EnumData.ErrorCode.NonVerify.engName,
                message: "Please verify account before login!",
                email: email
            }
        }

        const token = jwt.sign({ 
            userId: user.id,
            email: user.email,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            isAdmin: user.isAdmin,
            isVerify: user.isVerify,
            haveProfile: user.haveProfile
        }, process.env.ACCESS_TOKEN, { expiresIn: '365d' }); 

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