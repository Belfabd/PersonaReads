import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Component, inject} from "@angular/core";
import {MatButtonModule} from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle
} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {Book} from "../../../common/types";
import {MatChip, MatChipSet} from "@angular/material/chips";

@Component({
    selector: 'book-dialog',
    templateUrl: './book-dialog.html',
    styleUrl: './book-dialog.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatChip,
        MatChipSet,
        NgOptimizedImage,
    ],
})
export class BookDialog {
    readonly dialogRef = inject(MatDialogRef<BookDialog>);
    book = inject<Book>(MAT_DIALOG_DATA);

    closeDialog() {
        this.dialogRef.close()
    }
}
