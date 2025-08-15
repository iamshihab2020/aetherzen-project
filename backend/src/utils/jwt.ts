import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { TokenPayload } from "../types/auth.types";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret";

export function signToken(
  payload: TokenPayload,
  expiresIn: string | number = process.env.JWT_ACCESS_EXPIRES_IN || "15m"
): string {
  const options: SignOptions = {
    // @ts-expect-error
    expiresIn: expiresIn as string | number,
  };

  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (typeof payload === "string" || !("userId" in payload)) {
      return null;
    }

    return payload as TokenPayload;
  } catch (err) {
    return null;
  }
}
