import { test, expect } from '@playwright/test';
import {deleteUser, getAllUsers} from "./helpers/api-user-helper";

export let baseURL: string = 'http://localhost:3000/users';

test('all users: should return empty array when no users', async ({ request }) => {
    const response = await getAllUsers(request);
    const currentUsers = await response.json();

    if (currentUsers.length === 0) {
        expect(currentUsers).toEqual([]);
        return;
    }

    for (const user of currentUsers) {
        await deleteUser(request, user.id);
    }

    const finalResponse = await getAllUsers(request);
    const allUsers = await finalResponse.json();
    expect(allUsers).toEqual([]);
});
