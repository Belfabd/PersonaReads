///<reference types="chrome"/>
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() {}

    async register(email: string, password: string) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                target: "offscreen",
                action: "register",
                email: email,
                password: password
            }, (response) => {
                resolve(response);
            });
        });
    }

    async login(email: string, password: string) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                target: "offscreen",
                action: "login",
                email: email,
                password: password
            }, async (response) => {
                resolve({error: response.error, authenticated: response.authenticated});
            });
        });
    }

    async isLoggedIn() {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({target: "offscreen", action: "isLoggedIn"}, (response) => {
                resolve(response.isLoggedIn);
            });
            setTimeout(() => {
                resolve({isLoggedIn: true});
            }, 3000);
        });
    }

    async logout() {
        await chrome.runtime.sendMessage({target: "offscreen", action: "logout"});
    }

}
