package kz.dreamteam.backend.repository;


import kz.dreamteam.backend.model.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApartmentsRepository extends JpaRepository<Apartment, Long> {
    // Custom queries can be added here if needed
}
