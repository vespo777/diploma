package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface InterestsRepository extends JpaRepository<Interest, Long> {

}

