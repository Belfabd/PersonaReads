///<reference types="chrome"/>
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  constructor() { }

  async getUserDetails(): Promise<any> {
    return await chrome.runtime.sendMessage({target: "offscreen", action: "get_user_details"});
  }

  async scanItem(name: string) {
    await chrome.runtime.sendMessage({target: "background", action: "analyze", name: name});
  }

}
