import { Observer } from '../../ObserverPattern';
import { Data } from "../../Data";
import { SystemInfo } from "../../SystemInfo";
import { ReservationData } from './ReservationData';

export class ReservationsPerStation implements SystemInfo, Observer {
    data: Data;

    public static create(): ReservationsPerStation {
        return new ReservationsPerStation();
    }
    
    public constructor() {
        this.data = new ReservationData();
    }
    public init(): void {}

    private getStationId(involvedentities:any): number|undefined{
        for(let ent of involvedentities) {
            if(ent.type==='stations'){
                return ent.id;
            }
        }
        return undefined;
    }
    
    public update(timeEntry: TimeEntry): void {
        for(let event of timeEntry.events) {
            
            switch(event.name) {
                case 'EventUserTriesToReserveSlot': {
                    const key=this.getStationId(event.involvedEntities);
                    if (event.result==='SUCCESSFUL_SLOT_RESERVATION') { 
                        this.data.increaseSuccessfulSlotReservations(key);
                    } else if (event.result==='FAILED_SLOT_RESERVATION') { 
                        this.data.increaseFailedSlotReservations(key);
                    }
                    break;
                }
                 case 'EventUserTriesToReserveBike': {
                    const key=this.getStationId(event.involvedEntities);
                    if (event.result==='SUCCESSFUL_BIKE_RESERVATION') { 
                        this.data.increaseSuccessfulBikeReservations(key);
                    } else if (event.result==='FAILED_BIKE_RESERVATION') { 
                        this.data.increaseFailedBikeReservations(key);
                    }
                    break;
                }
            }
        }
    }
       
    public getData(): Data {
        return this.data;
    }
}
