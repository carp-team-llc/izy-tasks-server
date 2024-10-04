import jwt, { JwtPayload  } from "jsonwebtoken";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const LoadUserInfo = (token: string) => {
  try {
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    if (typeof decoded === 'object' && (decoded as JwtPayload).userId) {
      return decoded as JwtPayload;
    } else {
      throw new Error("Invalid token");
    }
  } catch (err: any) {
    console.error(err);
  }
};

export { LoadUserInfo }
