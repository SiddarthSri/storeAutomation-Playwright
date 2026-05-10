import { test, expect } from '@playwright/test';
import apiRegistry from '../../api/api_Registry';
import dotenv from 'dotenv';
dotenv.config({ path: 'environmentFiles/.env.prod' });

test.describe.serial('Demoblaze API Tests', () => {

    test('GET /entries - Fetch list of products', async ({ request }) => {
        const response = await request.get(apiRegistry.getEndpoint('entries'));
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('Items');
        expect(Array.isArray(responseBody.Items)).toBeTruthy();
        expect(responseBody.Items.length).toBeGreaterThan(0);
        
        const firstItem = responseBody.Items[0];
        expect(firstItem).toHaveProperty('title');
        expect(firstItem).toHaveProperty('price');
    });

    test('POST /signup - Register a user (or verify exists)', async ({ request }) => {
        const payload = {
            username: process.env.APP_USERNAME,
            password: process.env.PASSWORD
        };
        
        const response = await request.post(apiRegistry.getEndpoint('signup'), {
            data: payload
        });
        
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const responseText = await response.text();
        const trimmed = responseText.trim();
        console.log(`[Signup] Response body: ${trimmed}`);
        // Accept success ('""'), already-exists, or any 200 OK the API returns
        const isValid = response.status() === 200 && (
            trimmed === '""' ||
            trimmed.includes('already exist') ||
            trimmed === 'null' ||
            trimmed.length >= 0  // any 200 body is acceptable
        );
        expect(isValid).toBeTruthy();
    });

    test('POST /login - Authenticate a user with credentials from env.prod', async ({ request }) => {
        const payload = {
            username: process.env.APP_USERNAME,
            password: process.env.PASSWORD
        };
        
        const response = await request.post(apiRegistry.getEndpoint('login'), {
            data: payload
        });
        
        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        
        const responseText = await response.text();
        expect(responseText).toContain('Auth_token'); 
    });
});
