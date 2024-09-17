import jwt from "jsonwebtoken";

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const LoadUserInfo = (token: string) => {
  try {
    if (!token) {
      throw new Error();
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN);
    return decoded;
  } catch (err: any) {
    console.error(err);
  }
};

export { LoadUserInfo }
