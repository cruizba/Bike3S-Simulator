package es.urjc.ia.bikesurbanfleets.infraestructure;

import es.urjc.ia.bikesurbanfleets.common.graphs.GeoPoint;
import es.urjc.ia.bikesurbanfleets.common.graphs.GraphHopperIntegration;
import es.urjc.ia.bikesurbanfleets.common.graphs.GraphManager;
import es.urjc.ia.bikesurbanfleets.common.interfaces.StationInfo;
import es.urjc.ia.bikesurbanfleets.common.util.BoundingBox;
import es.urjc.ia.bikesurbanfleets.common.util.SimulationRandom;
import es.urjc.ia.bikesurbanfleets.infraestructure.entities.Bike;
import es.urjc.ia.bikesurbanfleets.infraestructure.entities.Reservation;
import es.urjc.ia.bikesurbanfleets.infraestructure.entities.Station;
import es.urjc.ia.bikesurbanfleets.users.User;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * This class contains all the information of all the entities at the system.
 * It provides all the usable methods by the user at the system.
 * @author IAgroup
 */
public class InfraestructureManager {

    /**
     * These are all the stations at the system.
     */
    private List<Station> stations;
    
    /**
     * These is the stations information for the consult agents
     */
    private List<StationInfo> stationsInfo;
    
    /**
     * These are all the bikes from all stations at the system.
     */
    private List<Bike> bikes;
    
    /**
     * These are all the bike and slot reservations (and reservation attempts) of all the users at the system.
     */
    private List<Reservation> reservations;
    
    /**
     * It is a global random instance with an specific seed.
     */
    private SimulationRandom random;
    
    /**
     * It represents the map area where simulation is taking place.
     */
    private BoundingBox bbox;
    
    public InfraestructureManager(List<Station> stations, BoundingBox bbox) throws IOException {
        this.stations = new ArrayList<>(stations);
        this.stationsInfo = new ArrayList<>(stations);
        this.bikes = stations.stream().map(Station::getBikes).flatMap(List::stream).filter(Objects::nonNull).collect(Collectors.toList());
        this.reservations = new ArrayList<>();
        this.bbox = bbox;
    }
    
    /**
     * It registers a user bike or slot reservation, in any state, in system reservation information.
     * @param reservation: it is the reservation which we want to save.
     */
    public void addReservation(Reservation reservation) {
        this.reservations.add(reservation);
    }

    /**
     * It obtains all the bike and slot reservations user has gotten to make, including
     * those that have expired because of reservation timeout, and reservations which
     * user has tried to make but he hasn't been able because there weren't available bikes or slots.
     * @param user: it is the user whose reservations want to be consulted
     * @return a list of all the bike and slot reservations which the specified user
     * has makde and has tried to made.
     */
    public List<Reservation> consultReservations(User user) {
        return reservations.stream().filter(reservation -> reservation.getUser().getId() == user.getId()).collect(Collectors.toList());
    }

    public List<StationInfo> consultStations() {
        return stationsInfo;
    }
    
    public SimulationRandom getRandom() {
        return random;
    }
    public GeoPoint generateBoundingBoxRandomPoint(SimulationRandom random) {
        return bbox.randomPoint(random);
    }
    
}