import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class MapSettingsService {
    public isMapLocked = new Subject<boolean>();
    public isTopologySummaryVisible: boolean = false;
    public isLogConsoleVisible: boolean = false;

    constructor() {}

    changeMapLockValue(value: boolean) {
        this.isMapLocked.next(value);
    }

    toggleTopologySummary(value: boolean) {
        this.isTopologySummaryVisible = value;
    }

    toggleLogConsole(value: boolean) {
        this.isLogConsoleVisible = value;
    }
}
