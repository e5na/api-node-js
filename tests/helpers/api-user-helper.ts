import { type APIRequestContext } from "@playwright/test";
import { baseURL } from "../user-controller.test";

export async function createUser(request: APIRequestContext): Promise<any> {
    const newUser = await request.post(baseURL)
    return await newUser.json()
}

export async function deleteUser(request: APIRequestContext, userId: number): Promise<any> {
    return await request.delete(baseURL + '/' + userId)
}

export async function getUserById(request: APIRequestContext, userId: number): Promise<any> {
    return await request.get(baseURL + '/' + userId)
}

export async function getAllUsers(request: APIRequestContext): Promise<any> {
    return await request.get(baseURL)

}

