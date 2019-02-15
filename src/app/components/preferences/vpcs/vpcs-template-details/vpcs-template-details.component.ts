import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { ServerService } from '../../../../services/server.service';
import { Server } from '../../../../models/server';
import { ToasterService } from '../../../../services/toaster.service';
import { VpcsService } from '../../../../services/vpcs.service';
import { VpcsTemplate } from '../../../../models/templates/vpcs-template';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { VpcsConfigurationService } from '../../../../services/vpcs-configuration.service';


@Component({
    selector: 'app-vpcs-template-details',
    templateUrl: './vpcs-template-details.component.html',
    styleUrls: ['./vpcs-template-details.component.scss','../../preferences.component.scss']
})
export class VpcsTemplateDetailsComponent implements OnInit {
    server: Server;
    vpcsTemplate: VpcsTemplate;
    inputForm: FormGroup;

    isSymbolSelectionOpened: boolean = false;
    copyOfSymbol: string;

    consoleTypes: string[] = [];
    categories = [];

    constructor(
        private route: ActivatedRoute,
        private serverService: ServerService,
        private vpcsService: VpcsService,
        private toasterService: ToasterService,
        private formBuilder: FormBuilder,
        private vpcsConfigurationService: VpcsConfigurationService
    ) {
        this.inputForm = this.formBuilder.group({
            templateName: new FormControl('', Validators.required),
            defaultName: new FormControl('', Validators.required),
            scriptFile: new FormControl('', Validators.required),
            symbol: new FormControl('', Validators.required)
        });
    }

    ngOnInit() {
        const server_id = this.route.snapshot.paramMap.get("server_id");
        const template_id = this.route.snapshot.paramMap.get("template_id");
        this.serverService.get(parseInt(server_id, 10)).then((server: Server) => {
            this.server = server;

            this.getConfiguration();
            this.vpcsService.getTemplate(this.server, template_id).subscribe((vpcsTemplate: VpcsTemplate) => {
                this.vpcsTemplate = vpcsTemplate;
            });
        });
    }

    getConfiguration() {
        this.consoleTypes = this.vpcsConfigurationService.getConsoleTypes();
        this.categories = this.vpcsConfigurationService.getCategories();
    }

    onSave() {
        if (this.inputForm.invalid) {
            this.toasterService.error(`Fill all required fields`);
        } else {
            this.vpcsService.saveTemplate(this.server, this.vpcsTemplate).subscribe((vpcsTemplate: VpcsTemplate) => {
                this.toasterService.success("Changes saved");
            });
        }
    }

    chooseSymbol() {
        this.copyOfSymbol = this.vpcsTemplate.symbol;
        this.isSymbolSelectionOpened = !this.isSymbolSelectionOpened;
    }

    cancelChooseSymbol() {
        this.isSymbolSelectionOpened = !this.isSymbolSelectionOpened;
        this.vpcsTemplate.symbol = this.copyOfSymbol;
    }

    symbolChanged(chosenSymbol: string) {
        this.vpcsTemplate.symbol = chosenSymbol;
    }
}
