import { test, expect } from '@playwright/test';
import { getAllUsers } from "./helpers/api-user-helper";

export let baseURL: string = 'http://localhost:3000/users';

test('all users: should return empty array when no users', async ({ request }) => {
    const allUsers = await getAllUsers(request);
    expect(await allUsers.text()).toBe('[]');
});
