// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import { createUser, deleteUser, getAllUsers, getUserById } from "./helpers/api-user-helper";
import { StatusCodes } from 'http-status-codes';

export let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test('all users: should return empty array when no users', async ({ request }) => {
        const allUsers = await getAllUsers(request);
        expect(await allUsers.text()).toBe('[]');
    });

    test('find user: should return a user by ID', async ({ request }) => {
        const user = await createUser(request);
        const newUser = await getUserById(request, user.id);
        const newUserJson = await newUser.json()
        expect(newUserJson.id).toBe(user.id);
    });

    test('find user: should return 404 if user not found', async ({ request }) => {
        const user = await createUser(request);
        await deleteUser(request, user.id);
        const notFoundResponse = await getUserById(request, user.id);
        expect(await notFoundResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });

    test('create user: should add a new user', async ({ request }) => {
        const user = await createUser(request);
        expect(user.id).toBeDefined();
    });

    test('delete user: should delete a user by ID', async ({ request }) => {
        const user = await createUser(request);
        const deletedUser = await deleteUser(request, user.id);
        expect(deletedUser.status()).toBe(StatusCodes.OK);
    });

    test('delete user: should return 404 if user not found', async ({ request }) => {
        const user = await createUser(request);
        await deleteUser(request, user.id);
        const notFoundResponse = await deleteUser(request, user.id);
        expect(notFoundResponse.status()).toBe(StatusCodes.NOT_FOUND);
    });
});