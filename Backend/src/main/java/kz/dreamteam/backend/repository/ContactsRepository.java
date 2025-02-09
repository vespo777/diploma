package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.Contacts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactsRepository extends JpaRepository<Contacts, Long> {
}
