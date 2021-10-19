import "dotenv/config";
import axios from "axios";
import prismaClient from "../prisma"

import { sign } from "jsonwebtoken"
import { response } from "express";

/**
 * 1 - Receber o code(String)
 * 2 - Recuperar o access_token no github
 * 3 - Recuperar infos do usuario no github
 * 4 - Verificar se o usuário existe no DB
 *    a) ------- SIM = Gerar um token
 *    b)------- NAO = Cria um usuário e gera um token
 * 5 - Retornar o token com as informaçoes do usuário
 */

interface IAccessTokenResponse {
    access_token: string
}

interface IUserResponse {
    id: number,
    name: string
    login: string,
    avatar_url: string,
}


class AuthenticateUserService {
    async execute(code: string) {        
        const url = `${process.env.GITHUB_BASE_URL}/login/oauth/access_token`;

        const { data: accessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, {
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        })


        const response = await axios.get<IUserResponse>(`${process.env.GITHUB_API_BASE_URL}/user`, {
            headers: {
                authorization: `Bearer ${accessTokenResponse.access_token}`,
            },
        });

        const { id, name, login, avatar_url } = response.data;

        let user = await prismaClient.user.findFirst({
            where: {
                github_id: id
            }
        });


        if (!user) {
            user = await prismaClient.user.create({
                data: {
                    github_id: id,
                    name,
                    login,
                    avatar_url,
                }
            })
        }

        const token = sign(
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                },
            },
            process.env.SALT_KEY,
            {
                subject: user.id,
                expiresIn: "1d",
            }
        )

        return { token, user };
    }
}

export { AuthenticateUserService }