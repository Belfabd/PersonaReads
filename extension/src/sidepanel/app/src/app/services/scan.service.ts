import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScanService {

  constructor() { }

  async scanItem(url: string) {
    await chrome.runtime.sendMessage({target: "background", action: "analyze", url: url});
  }

}
