import {AfterViewInit, Component, Inject, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {CategoryService} from "../../services/category.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {EMPTY, finalize} from "rxjs";
import {Meta} from '@angular/platform-browser';


@Component({
    selector: 'app-add-view-category',
    templateUrl: './add-category.component.html',
    styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {

    private paternUrlValidation: string = "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()!@:%_\\+.~#?&\\/\\/=]*)"

    public regionId: number;
    public title: string;
    user: User | null = null;

    form: FormGroup;


    constructor(private meta: Meta, private categoryService: CategoryService, private authService: AuthService, private fb: FormBuilder,
                private dialogRef: MatDialogRef<AddCategoryComponent>,
                @Inject(MAT_DIALOG_DATA) data: any) {

        this.regionId = data.regionId;
        this.title = data.regionName;
        this.updateUser();
    }

    controlNames: string[] = [];

    ngOnInit() {
        this.form = this.fb.group({});

        this.addNewControl()
        console.log(this.meta.getTag('name=viewport'))
        this.meta.updateTag(
            {name: 'viewport', content: 'width=device-width, maximum-scale=1.0, minimum-scale=1.0'},
            'name=viewport'
        );
    }

    submit() {
        if (this.form.valid) {
            let category: object = {
                "program": this.form.get('program')?.value,
                "responsible_officials": this.form.get('responsibleOfficials')?.value,
                "complaint_info": this.form.get('complaintInfo')?.value,
                "events_info": this.form.get('eventsInfo')?.value,
                "region": this.regionId,
            }
            this.categoryService.createCategory(category).subscribe()
            this.dialogRef.close();
        }
    }

    close() {
        this.dialogRef.close();
    }

    updateUser() {
        this.authService.getCurrentUser$().subscribe(user => this.user = user.id ? user : null);
    }

    createCategories() {
        const formKeys = Object.keys(this.form.controls);
        const lastControlIndex = formKeys[formKeys.length - 1];

        for (let categoryIndex of Object.keys(this.form.controls)) {
            const categoryValue = this.form.value[categoryIndex];

            const categoryToSave = {
                region: this.regionId,
                url: categoryValue.url,
                name: categoryValue.name
            };

            this.categoryService.createCategory(categoryToSave)
                .pipe(finalize(() => lastControlIndex == categoryIndex ? this.dialogRef.close() : EMPTY))
                .subscribe(saved => console.log(saved));
        }

    }

    index: number = 0;

    addNewControl() {

        this.controlNames.push(this.index + "");
        this.form.addControl(this.index + "", this.fb.group({
            'name': this.fb.control('', Validators.required),
            'url': this.fb.control('', [Validators.required, Validators.pattern(this.paternUrlValidation)]),
        }));
        this.index++;

    }

    changeZoom() {
        this.meta.updateTag(
            {name: 'viewport', content: 'width=device-width, maximum-scale=10.0, minimum-scale=1.0'},
            `name='viewport'`
        );
    }

    removeControl(controlName) {
        const index = this.controlNames.findIndex(item => {
            return item == controlName
        })
        if (index === -1) {
            return;
        }
        this.controlNames.splice(index, 1);
        this.form.removeControl(controlName);
    }
}
