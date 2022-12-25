import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CategoryService} from "../../../services/category.service";
import {Category} from "../../../models/category.model";

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

    private id: number;
    title: string = 'Підтвердження видалення'

    constructor(private categoryService: CategoryService, private dialog: MatDialog,
                private dialogRef: MatDialogRef<ConfirmationComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {
        this.id = data.id;
    }

    ngOnInit(): void {

    }

    close() {
        this.dialogRef.close();
    }

    delete() {
        this.categoryService.deleteCategory(this.id).subscribe()
        this.dialogRef.close();
    }
}
