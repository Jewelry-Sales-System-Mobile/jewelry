import jwt from "jsonwebtoken";
import { TokenPayload } from "~/models/requests/Users.requests";

export const signToken = ({
  payload,
  options = {
    algorithm: "HS256",
  },
  secret,
}: {
  payload: string | object | Buffer;
  options?: jwt.SignOptions;
  secret: string;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        throw reject(err);
      } else {
        resolve(token as string);
      }
    });
  });
};

export const verifyToken = ({
  token,
  secret,
}: {
  token: string;
  secret: string;
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        throw reject(err);
      } else {
        resolve(decoded as TokenPayload);
      }
    });
  });
};
