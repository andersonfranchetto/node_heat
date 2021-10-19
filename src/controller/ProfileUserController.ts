import { Request, Response } from "express";
import { ProfileUserService } from "../services/ProfileUserService";

class ProfileUserController {
    async handle(request: Request, response: Response) {
        const service = new ProfileUserService();

        const { user_id } = request.body;

        try {
            const result = await service.execute(user_id);

            return response.json(result);
        } catch (error) {
            return response.json({
                status: error.response.status,
                message: error.message
            });
        }
    }
}

export { ProfileUserController }