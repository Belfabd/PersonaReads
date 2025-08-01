///<reference types="chrome"/>
import {Component, inject, NgZone, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ScanService} from "../../services/scan.service";
import {Router} from "@angular/router";
import {fromEventPattern} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MatButtonModule, MatIconButton} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {Book, BookAnalysis} from "../../common/types";
import {MatCard} from "@angular/material/card";
import {MatChip, MatChipSet} from "@angular/material/chips";
import {BookDialog} from "./book/book-dialog";
import {MatDialog} from "@angular/material/dialog";
import {PersonasDialog} from "./personas/personas-dialog";

@Component({
    selector: 'app-home',
    imports: [
        NgClass,
        MatButtonModule,
        MatProgressSpinnerModule,
        NgIf,
        MatIconButton,
        MatIconModule,
        MatToolbar,
        MatCard,
        NgOptimizedImage,
        MatChipSet,
        MatChip,
        NgForOf,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    readonly dialog = inject(MatDialog);

    // Data
    scanningLoading = false;
    name: string | undefined;
    bookAnalysis: BookAnalysis | null = null;

    // UX
    currentRecommendedIndex = 0;

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
                if (message.target == "sidepanel" && message.action == "tab") {
                    const tabState = message.state;
                    this.name = tabState?.name;
                    this.scanningLoading = tabState?.isLoading ?? false;
                    if (tabState?.analysis) {
                        this.scanningLoading = false;
                        const analysis = tabState?.analysis;
                        if (analysis.error != null) this._snackBar.open(analysis.error);
                        else this.bookAnalysis = analysis.bookAnalysis
                    } else this.bookAnalysis = null;
                }
            });
        });
    }

    async scanItem() {
        this.scanningLoading = true;
        if (this.name != undefined) await this.scannerService.scanItem(this.name);
        else this._snackBar.open("No proper URL found! Reload page to get URL!");
    }

    getCurrentRecommendedBook(): Book {
        return this.bookAnalysis!.recommendations![this.currentRecommendedIndex];
    }

    previousBook(): void {
        if (this.currentRecommendedIndex > 0) {
            this.currentRecommendedIndex--;
        }
    }

    nextBook(): void {
        if (this.currentRecommendedIndex < this.bookAnalysis!.recommendations!.length - 1) {
            this.currentRecommendedIndex++;
        }
    }

    async openPersona() {
        const resultUser = await this.scannerService.getUserDetails()
        const ref = this.dialog.open(PersonasDialog);
        ref.componentInstance.updateData(resultUser?.user);
    }

    showBookDetails() {
        this.dialog.open(BookDialog, {data: this.bookAnalysis!.recommendations[this.currentRecommendedIndex]});
    }

    async logout(): Promise<void> {
        await this.authService.logout();
        await this.router.navigate(['login']);
    }
}
