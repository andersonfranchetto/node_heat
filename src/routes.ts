import { Router } from "express";
import { AuthenticateUserController } from "./controller/AuthenticateUserController";
import { CreateMessageController } from "./controller/CreateMessageController";
import { GetLastTreeMessagesController } from "./controller/GetLastTreeMessagesController";
import { ProfileUserController } from "./controller/ProfileUserController";
import { EnsureAuthenticated } from "./middlewares/EnsureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle)
router.post("/messages", EnsureAuthenticated, new CreateMessageController().handle)
router.get("/messages/last3", new GetLastTreeMessagesController().handle)
router.get("/profile", EnsureAuthenticated, new ProfileUserController().handle)


router.get("/github", (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`)
});

router.get("/signin/callback", (request, response) => {
    const { code } = request.query;

    return response.json(code);
});

export { router }