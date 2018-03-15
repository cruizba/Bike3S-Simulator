import {Component, Inject, OnDestroy} from '@angular/core';
import { Layer } from 'leaflet';
import * as moment from 'moment';

import { AjaxProtocol } from '../../ajax/AjaxProtocol';
import { STATE, VisualizationEngine } from './visualization.engine';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'visualization',
    template: require('./visualization.component.html'),
    styles: [require('./visualization.component.css')],
})
export class Visualization{

    private static readonly REFRESH_RATE = 200;

    private static activeLayers: Set<Layer>;

    readonly STATE = STATE; // make STATE available in template

    engine: VisualizationEngine;

    static hasLayer(layer: Layer) {
        return this.activeLayers.has(layer);
    }

    static addLayer(layer: Layer) {
        return this.activeLayers.add(layer);
    }

    static deleteLayer(layer: Layer) {
        return this.activeLayers.delete(layer);
    }

    constructor(@Inject('AjaxProtocol') private ajax: AjaxProtocol, private modalService: NgbModal) {}

    ngOnInit() {
        Visualization.activeLayers = new Set();
        this.engine = new VisualizationEngine(this.ajax, Visualization.activeLayers, Visualization.REFRESH_RATE);
    }

    open(content: any) {
        this.modalService.open(content).result.then((result) => {
            console.log(content);
        });
    }

    is(...states: Array<STATE>): boolean;
    is(...states: Array<[STATE, boolean]>): boolean;
    is(...states: Array<STATE | [STATE, boolean]>): boolean {
        return this.engine.is(...(states as Array<any>));
    }

    togglePlayPause() {
        if (this.is(STATE.NOT_RUNNING)) {
            this.engine.updateState(this.engine.speed > 0 ? STATE.FORWARD : STATE.REWIND);
        } else {
            this.engine.updateState(STATE.PAUSED);
        }
    }

    changeSpeed(n: number) {
        this.engine.speed += (this.engine.speed + n === 0) ? 2 * n : n;

        if (this.is([STATE.FORWARD, this.engine.speed < 0])) {
            this.engine.updateState(STATE.REWIND);
        } else if (this.is([STATE.REWIND, this.engine.speed > 0])) {
            this.engine.updateState(STATE.FORWARD);
        }

        this.engine.speedControl.setValue(this.engine.speed, this.engine.NO_EMIT);
    }

    get formattedTime() {
        if (this.engine.time === undefined || this.engine.time < 0) return '--:--:--';
        return moment.unix(this.engine.time).utc().format('HH:mm:ss');
    }
}