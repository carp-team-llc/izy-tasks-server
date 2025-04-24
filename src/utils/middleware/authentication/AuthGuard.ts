
export function AuthGuard(req: any) {
  const token = req.cookies?.token;
  if (!token) {
    return {
      statusCode: 401,
      message: 'Unauthorized',
    };
  }

  return token;
}