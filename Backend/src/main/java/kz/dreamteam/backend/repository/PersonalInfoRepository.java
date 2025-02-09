package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.LocationDetails;
import kz.dreamteam.backend.model.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;


public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {

}
