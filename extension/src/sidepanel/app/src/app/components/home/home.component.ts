import {Component, inject, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ScanService} from "../../services/scan.service";
import {Router} from "@angular/router";
import {fromEventPattern} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  //Data
  scanningLoading = false;
  url: string | undefined;

  constructor(private router: Router, private authService: AuthService, private scannerService: ScanService, private zone: NgZone) {
    chrome.runtime.sendMessage({target: "background", action: "init"}).then(() => console.log("Sidepanel Opened"));
  }

  async ngOnInit(): Promise<void> {
    // listen to messages
    fromEventPattern(
        (handler) => chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => handler(message)),
        (handler) => chrome.runtime.onMessage.removeListener(handler),
    ).subscribe((message: any) => {
      this.zone.run(async () => {
        if (message.target == "sidepanel") switch (message.action) {
          case "loading":
            this.scanningLoading = message.state.isLoading;
            break;
          case "tab":
            const tabState = message.state;
            this.url = tabState?.url;
            break;

          case "analysis":
            const state = message.state;
            if (state.error != null) this._snackBar.open(state.error);
            else {
              // TODO: Apply changes
            }
            break;
        }
      });
    });
  }

  async scanItem() {
    this.scanningLoading = true;
    if (this.url != undefined) await this.scannerService.scanItem(this.url);
    else this._snackBar.open("No proper URL found! Reload page to get URL!");
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['login']);
  }

}
