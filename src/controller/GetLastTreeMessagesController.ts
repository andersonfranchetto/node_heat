import { Request, Response } from "express";
import { GetLastTreeMessagesService } from "../services/GetLastTreeMessagesService";

class GetLastTreeMessagesController {
    async handle(request: Request, response: Response) {
        const service = new GetLastTreeMessagesService();

        try {
            const result = await service.execute();

            return response.json(result);
        } catch (error) {
            return response.json({
                status: error.response.status,
                message: error.message
            });
        }
    }
}

export { GetLastTreeMessagesController }