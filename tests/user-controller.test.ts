// tests/api.spec.ts
import { test, expect } from '@playwright/test';
import { createUser, deleteUser, getAllUsers, getUserById } from "./helpers/api-user-helper";
import { StatusCodes } from 'http-status-codes';

export let baseURL: string = 'http://localhost:3000/users';

test.describe('User management API', () => {

    test.beforeEach(async ({ request }) => {
        // get all users
        const response = await request.get(`${baseURL}`);
        const responseBody = await response.json()
        // get the number of objects in the array returned
        const numberOfObjects = responseBody.length;

        // create an empty array to store all user ID
        let userIDs = [];

        // loop through all users and store their ID in an array
        for (let i = 0; i < numberOfObjects; i++) {
            // get user ID from the response
            let userID = responseBody[i].id;
            // push is used to add elements to the end of an array
            userIDs.push(userID);
        }

        // delete all users in a loop using previously created array
        for (let i = 0; i < numberOfObjects; i++) {
            // delete user by id
            let response = await request.delete(`${baseURL}/${userIDs[i]}`);
            // validate the response status code
            expect.soft(response.status()).toBe(200);
        }

        // verify that all users are deleted
        const responseAfterDelete = await request.get(`${baseURL}`);
        expect(responseAfterDelete.status()).toBe(200);
        const responseBodyEmpty = await responseAfterDelete.text()
        // validate that the response is an empty array
        expect(responseBodyEmpty).toBe('[]');
    })

    test('all users: should return empty array when no users', async ({ request }) => {
        const response = await request.get(`${baseURL}`);
        expect(response.status()).toBe(200);
        const responseBody = await response.text()
        expect(responseBody).toBe('[]');
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