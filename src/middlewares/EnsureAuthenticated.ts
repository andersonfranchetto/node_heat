import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";


interface IPayload {
    sub: string
}

export function EnsureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if (!authToken)
        return response.status(401).json({ errorCode: "token.invalid" });
    try {

        const { sub } = verify(authToken.split(" ")[1], process.env.SALT_KEY) as IPayload;

        request.body['user_id'] = sub;

        return next();
    } catch (error) {
        return response.status(401).json({message: error.message})
    }


}