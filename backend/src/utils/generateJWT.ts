import jwt from "jsonwebtoken";

export const generateJWT = (id: string) => {
  const jwtToken = jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });

  return jwtToken;
};
