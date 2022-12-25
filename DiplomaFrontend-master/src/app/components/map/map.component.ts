import {AfterViewInit, Component, ElementRef, HostListener, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {RegionService} from "../../services/region.service";
import {Region} from "../../models/region.model";
import {AddCategoryComponent} from "../add-category/add-category.component";
import {RetrieveCategoryComponent} from "../retrieve-category/retrieve-category.component";
import {CookieService} from "ngx-cookie-service";
import * as SvgPanZoom from 'svg-pan-zoom';
import {Meta} from "@angular/platform-browser";

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
    private regions: Region[];
    private regionName: string | undefined;
    private regionId: number | undefined;
    private created: boolean | undefined;
    @ViewChildren('region') tags: QueryList<any>;
    @ViewChildren('city') tagsCity: QueryList<any>;
    @ViewChild('map', {static: false}) map: ElementRef;

    public scheme: SvgPanZoom.Instance;
    public options = {
        panEnabled: false,
        controlIconsEnabled: false,
        zoomEnabled: true,
        mouseWheelZoomEnabled: true,
        preventMouseEventsDefault: false,
        zoomScaleSensitivity: 0.2,
        minZoom: 1,
        maxZoom: 8,
        fit: true,
        contain: false,
        center: true,
        onZoom: function () {
            if (this.getZoom() >= 2.4) {
                this.enablePan()
            } else {
                this.disablePan()
            }
        }
    };

    constructor(private meta: Meta, private regionService: RegionService, private cookie: CookieService, private dialog: MatDialog) {
        this.regionService.getRegions().subscribe(data => {
            this.regions = data
            this.changeColor()
        })
    }

    changeColor(): void {
        let regionsAccepted = this.regions.filter(region => region.accepted).map(region => region.name)
        let tagsResult = this.tags['_results']
        tagsResult.forEach((item: { nativeElement: { getAttribute: (arg0: string) => string; style: { fill: string; }; }; }) => {
            if (regionsAccepted.indexOf(item.nativeElement.getAttribute('data-region')) != -1) {
                item.nativeElement.style.fill = '#b0d1e3'
            }
        })
        let tagsResultCity = this.tagsCity['_results']
        tagsResultCity.forEach((item: { nativeElement: { getAttribute: (arg0: string) => string; style: { fill: string; }; }; }) => {
            if (regionsAccepted.indexOf(item.nativeElement.getAttribute('data-region')) != -1) {
                item.nativeElement.style.fill = '#FFE358'
            }
        })
    }

    changeColorBack(): void {
        let regionsAccepted = this.regions.filter(region => !region.accepted).map(region => region.name)
        let tagsResult = this.tags['_results']
        tagsResult.forEach((item: { nativeElement: { getAttribute: (arg0: string) => string; style: { fill: string; }; }; }) => {
            if (regionsAccepted.indexOf(item.nativeElement.getAttribute('data-region')) != -1) {
                item.nativeElement.style.fill = '#f8f4f0'
            }
        })
        let tagsResultCity = this.tagsCity['_results']
        tagsResultCity.forEach((item: { nativeElement: { getAttribute: (arg0: string) => string; style: { fill: string; }; }; }) => {
            if (regionsAccepted.indexOf(item.nativeElement.getAttribute('data-region')) != -1) {
                item.nativeElement.style.fill = '#f8f4f0'
            }
        })
    }

    ngAfterViewInit(): void {
        if (this.isIOSDevice()) {
            this.scheme = SvgPanZoom(this.map.nativeElement, this.options);
            document.body.style.touchAction = 'pan-y';
        }
    }

    something(event: any) {
        let region: string = event.target.dataset.region
        this.getRegion(this.regions, region)
        if (this.created) {
            this.openRetrieveDialog()
        } else {
            this.openCreateDialog()
        }
    }

    getRegion(regions: Region[], regionNameByClick: string): void {
        console.log("Region: " + regionNameByClick)
        let region: Region | undefined;
        region = this.regions.find(item => item.name == regionNameByClick)
        this.regionName = region?.name
        this.regionId = region?.id
        this.created = region?.accepted
    }

    openCreateDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = "create-category"
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            regionId: this.regionId,
            regionName: this.regionName,
        }
        console.log(this)
        console.log(dialogConfig)
        this.dialog.open(AddCategoryComponent, dialogConfig).afterClosed().subscribe(data => {
            this.regionService.getRegions().subscribe(data => {
                this.regions = data
                this.changeColor()
            })
        });
        if (this.isIOSDevice()) {
            this.scheme.zoom(1);
            this.scheme.center();
        }
    }

    isIOSDevice() {
        return !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    }

    // popup for view records
    openRetrieveDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.panelClass = "retrieve-category"
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;

        dialogConfig.data = {
            regionId: this.regionId,
            regionName: this.regionName,
        }
        this.dialog.open(RetrieveCategoryComponent, dialogConfig).afterClosed().subscribe(data => {
            this.regionService.getRegions().subscribe(data => {
                this.regions = data
                this.changeColor()
                this.changeColorBack()
            })
        });
        if (this.isIOSDevice()) {

            this.scheme.zoom(1);
            this.scheme.center();
        }
    }

    changeScroll($event: any) {
        if (this.isIOSDevice()) {
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';
        }
    }

    plus() {
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        this.scheme.zoomIn();
    }

    minus() {
        this.scheme.zoomOut();
    }

    default() {
        document.body.style.height = 'auto';
        document.body.style.overflow = 'auto';
        this.scheme.resetZoom();
        this.scheme.center();
    }

    @HostListener('window:orientationchange', ['$event'])
    onOrientationChange(event) {
        if (this.isIOSDevice()) {
            window.location.reload();
        }
    }
}
