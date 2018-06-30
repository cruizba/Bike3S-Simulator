import {Component, Inject} from "@angular/core";
import {CoreSimulatorArgs, UserGeneratorArgs} from "../../../shared/BackendInterfaces";
import * as $ from "jquery";
import {AjaxProtocol} from "../../ajax/AjaxProtocol";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
const { dialog } = (window as any).require('electron').remote;
const { ipcRenderer } = (window as any).require('electron');

@Component({
    selector: 'simulatecore-component',
    template: require('./simulatecore.component.html'),
    styles: [require('./simulatecore.component.css')]
})
export class SimulatecoreComponent{

    private globalConfiguration: string;
    private usersConfiguration: string;
    private stationsConfiguration: string;
    private historyOutputPath: string;
    private mapPath: string;
    private percentage: number;

    private resultMessage: string;
    private exceptions: string;
    private errors: boolean;
    private finished: boolean;

    constructor(@Inject('AjaxProtocol') private ajax: AjaxProtocol, private modalService: NgbModal) {}

    async ngOnInit() {
        this.resultMessage = "";
        this.exceptions = "";
        this.percentage = 0;
        this.finished = false;

        ipcRenderer.on('core-error' , (event: Event, data: string) => this.addErrors(data));
        ipcRenderer.on('core-data', (event: Event, data: string) => this.addConsoleMessage(data));

        await this.ajax.backend.init();
    }

    selectFile(): string {
		return dialog.showOpenDialog({
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'JSON Files', extensions: ['json']}]
        })[0].replace(/\\/g, "/");
    }

    selectMap(): string {
        return dialog.showOpenDialog({
            properties: ['openFile', 'createDirectory'],
            filters: [{name: 'OSM Files', extensions: ['osm']}]
        })[0].replace(/\\/g, "/");
    }

    selectFolder(): string {
        return dialog.showOpenDialog({properties: ['openDirectory', 'createDirectory']})[0].replace(/\\/g, "/");
    }

    open(content: any) {
        this.modalService.open(content).result.then(() => {
        });
    }

    addErrors(error: string) {
        this.errors = true;
        this.resultMessage = "Simulation has ended with exceptions";
        this.exceptions += error;
    }

    addConsoleMessage(message: any) {
        let consoleMessage = message.toString();
        let consoleMessageList = consoleMessage.split('\n');
        consoleMessageList.forEach((indMessage: string) => {
            if(indMessage.includes("Percentage: ")) {
                let percentageStr = indMessage.replace('Percentage: ', '');
                let percentage: number = parseFloat(percentageStr);
                this.percentage = percentage;
                $('#progress-bar').trigger('click');
            }
            if(indMessage.includes("Error: ")) {
                this.errors = true;
                this.exceptions += indMessage + "\n";
            }
        });
    }

    async runSimulation() {
        this.errors = false;
        this.resultMessage = "Simulation in progress...";
        this.exceptions = "";
        this.percentage = 0;
        this.finished = false;
        let args: CoreSimulatorArgs = {
            globalConfPath: this.globalConfiguration,
            usersConfPath: this.usersConfiguration,
            stationsConfPath: this.stationsConfiguration,
            outputHistoryPath: this.historyOutputPath,
            mapPath: this.mapPath
        };
        console.log(args);
        $('#modal-button').trigger('click');
        await this.ajax.backend.simulate(args);
        if(!this.errors) {
            this.resultMessage = "Simulation completed";
        }
        this.finished = true;
    }

}