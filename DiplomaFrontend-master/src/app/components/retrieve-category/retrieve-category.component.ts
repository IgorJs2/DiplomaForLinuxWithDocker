import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CategoryService} from "../../services/category.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Category} from "../../models/category.model";
import {ConfirmationComponent} from "./confirmation/confirmation.component";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EMPTY, finalize} from "rxjs";
import {Meta} from "@angular/platform-browser";

@Component({
    selector: 'app-retrieve-category',
    templateUrl: './retrieve-category.component.html',
    styleUrls: ['./retrieve-category.component.css']
})
export class RetrieveCategoryComponent implements OnInit {

    private paternUrlValidation: string = "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)"

    private regionId: number;
    public title: string;
    public categories: Category[];
    public isEdite: boolean = false;
    public isCreate: boolean = false;

    user: User | null = null;

    form: FormGroup;

    constructor(private meta: Meta, private fb: FormBuilder, private categoryService: CategoryService, private dialog: MatDialog, private authService: AuthService,
                private dialogRef: MatDialogRef<RetrieveCategoryComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        this.regionId = data.regionId;
        this.title = data.regionName;
        this.updateUser()
        // this.meta.upda/**/teTag(
        //     {
        //         name: 'viewport',
        //         content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, target-densityDpi=device-dpi'
        //     },
        //     'name=viewport'
        // );
    }

    controlNames: string[] = [];

    ngOnInit(): void {
        this.categoryService.getCategoryByRegion(this.regionId).subscribe(categories => {
            this.categories = categories
            this.form = this.fb.group({});
            categories.forEach(category => {
                this.controlNames.push(category.id + "");
                this.form.addControl(category.id + "", this.fb.group({
                    'name': this.fb.control(category.name, Validators.required),
                    'url': this.fb.control(category.url, [Validators.required, Validators.pattern(this.paternUrlValidation)]),
                }));
            })
        })
        this.meta.updateTag(
            { name: 'viewport', content: 'width=device-width, maximum-scale=1.0, minimum-scale=1.0'},
            'name=viewport'
        );
    }

    close() {
        this.dialogRef.close();
    }

    edit() {
        this.isEdite = true;
    }

    delete(id) {
        this.openConfirmation(id)
    }

    openConfirmation(id) {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            id: id,
        }
        this.dialog.open(ConfirmationComponent, dialogConfig).afterClosed().subscribe(() => {
            this.close()
        })
    }

    updateUser() {
        this.authService.getCurrentUser$().subscribe(user => this.user = user.id ? user : null);
    }

    removeControl(controlIndex) {
        this.controlNames.splice(controlIndex, 1);
        this.form.removeControl(controlIndex);
        this.delete(+controlIndex)
    }

    editCategories() {
        this.isEdite = false;
        for (let i = 0; i < this.controlNames.length; i++) {
            const categoryId = this.controlNames[i]
            const categoryValue = this.form.value[categoryId];
            const categoryToSave = {
                region: this.regionId,
                url: categoryValue.url,
                name: categoryValue.name
            };
            // TODO use patch, not put
            this.categoryService.updateCategory(+categoryId, categoryToSave)
                .pipe(finalize(() => this.controlNames.length === i + 1 ? this.dialogRef.close() : EMPTY))
                .subscribe(saved => console.log(saved));
        }
    }

    index: number = 0;

    changeCreate() {
        this.isCreate = true;
    }

    changeZoom() {
        this.meta.updateTag(
            { name: 'viewport', content: 'width=device-width, maximum-scale=10.0, minimum-scale=1.0' },
            `name='viewport'`
        );
    }

}
