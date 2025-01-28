package kz.dreamteam.backend.service;

import kz.dreamteam.backend.model.Apartment;
import kz.dreamteam.backend.repository.ApartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApartmentService {

    private final ApartmentRepository apartmentRepository;

    public ApartmentService(ApartmentRepository apartmentRepository) {
        this.apartmentRepository = apartmentRepository;
    }

    // Create a new apartment
    public Apartment createApartment(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    // Get all apartments
    public List<Apartment> getAllApartments() {
        return apartmentRepository.findAll();
    }

    // Get apartment by ID
    public Optional<Apartment> getApartmentById(Long id) {
        return apartmentRepository.findById(id);
    }

    // Update apartment
    public Apartment updateApartment(Long id, Apartment updatedApartment) {
        return apartmentRepository.findById(id)
                .map(apartment -> {
                    apartment.setOwner(updatedApartment.getOwner());
                    apartment.setType(updatedApartment.getType());
                    apartment.setPhoto(updatedApartment.getPhoto());
                    apartment.setAddress(updatedApartment.getAddress());
                    apartment.setDescription(updatedApartment.getDescription());
                    apartment.setCallNumber(updatedApartment.getCallNumber());
                    apartment.setTelegramNickname(updatedApartment.getTelegramNickname());
                    apartment.setLinkToKrishaKz(updatedApartment.getLinkToKrishaKz());
                    return apartmentRepository.save(apartment);
                })
                .orElseThrow(() -> new RuntimeException("Apartment not found with id: " + id));
    }

    // Delete apartment
    public void deleteApartment(Long id) {
        apartmentRepository.deleteById(id);
    }
}
