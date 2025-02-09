package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.UserInterests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserInterestsRepository extends JpaRepository<UserInterests, Long> {
    // Custom queries can be added here if needed
}
