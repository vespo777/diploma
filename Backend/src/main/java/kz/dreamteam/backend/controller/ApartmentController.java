package kz.dreamteam.backend.controller;


import jakarta.validation.Valid;
import kz.dreamteam.backend.model.Apartment;
import kz.dreamteam.backend.model.User;
import kz.dreamteam.backend.model.dto.ApartmentDTO;
import kz.dreamteam.backend.repository.UserRepository;
import kz.dreamteam.backend.service.ApartmentService;
import kz.dreamteam.backend.service.GraphSearchService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apartments")
public class ApartmentController {
    private static final Logger log = LoggerFactory.getLogger(ApartmentController.class);

    private ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @GetMapping("/search")
    public List<Apartment> searchApartments(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Integer minRooms,
            @RequestParam(required = false) Integer maxRooms,
            @RequestParam(required = false) Integer minSize,
            @RequestParam(required = false) Integer maxSize) {

        return apartmentService.searchApartments(query, minRooms, maxRooms, minSize, maxSize);
    }

    // Create a new apartment
    @PostMapping("/create-apartment")
    public ResponseEntity<Apartment> createApartment(@RequestHeader("Authorization") String authorizationHeader,
                                                      @RequestBody ApartmentDTO apartmentDTO) {
        String token = authorizationHeader.startsWith("Bearer ")
                ? authorizationHeader.substring(7)
                : authorizationHeader;

        log.info(apartmentDTO.getPhotoPath());

        Apartment savedApartment = apartmentService.createApartment(token, apartmentDTO);
        return ResponseEntity.ok(savedApartment);
    }

    // Get all apartments
    @GetMapping
    public ResponseEntity<List<Apartment>> getAllApartments() {
        List<Apartment> apartments = apartmentService.getAllApartments();
        return ResponseEntity.ok(apartments);
    }

    // Get apartment by ID
    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getApartmentById(@PathVariable Long id) {
        return apartmentService.getApartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update apartment
    @PutMapping("/{id}")
    public ResponseEntity<Apartment> updateApartment(@PathVariable Long id, @RequestBody ApartmentDTO apartmentDTO) {
        Apartment apartment = apartmentService.updateApartment(id, apartmentDTO);
        return ResponseEntity.ok(apartment);
    }

    // Delete apartment
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable Long id) {
        apartmentService.deleteApartment(id);
        return ResponseEntity.noContent().build();
    }
}
