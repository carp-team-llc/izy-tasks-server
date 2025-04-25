
export function AuthGuard(req: any) {
  const token = req.cookies?.token;
  if (!token) {
    return null;
  }
  return token;
}