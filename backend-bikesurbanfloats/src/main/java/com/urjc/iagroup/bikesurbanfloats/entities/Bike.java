package com.urjc.iagroup.bikesurbanfloats.entities;

import com.urjc.iagroup.bikesurbanfloats.history.HistoryReference;
import com.urjc.iagroup.bikesurbanfloats.history.entities.HistoricBike;
import com.urjc.iagroup.bikesurbanfloats.util.IdGenerator;

@HistoryReference(HistoricBike.class)
public class Bike implements Entity {

    private static IdGenerator idGenerator = new IdGenerator();

    private int id;
    private boolean reserved;

    public Bike() {
        this.id  = idGenerator.next();
        this.reserved = false;
    }

    @Override
    public int getId() {
        return id;
    }

    public boolean isReserved() {
        return reserved;
    }

    public void setReserved(boolean reserved) {
        this.reserved = reserved;
    }
}
