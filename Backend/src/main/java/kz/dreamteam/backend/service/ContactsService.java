package kz.dreamteam.backend.service;

import kz.dreamteam.backend.dto.ContactsUpdateDTO;
import kz.dreamteam.backend.model.Contacts;
import kz.dreamteam.backend.model.dto.UpdateContactsDto;
import kz.dreamteam.backend.repository.ContactsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ContactsService {

    private final ContactsRepository repository;

    public ContactsService(ContactsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ResponseEntity<String> updateContacts(Long userId, UpdateContactsDto dto) {
        Optional<Contacts> optionalContacts = repository.findById(userId);

        if (optionalContacts.isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Contacts not found for user ID: " + userId);
        }

        Contacts contacts = optionalContacts.get();
        boolean updated = false;

        if (dto.getCallNumber() != null) {
            contacts.setCallNumber(dto.getCallNumber());
            updated = true;
        }
        if (dto.getTelegramNickname() != null) {
            contacts.setTelegramNickname(dto.getTelegramNickname());
            updated = true;
        }

        if (!updated) {
            return ResponseEntity.ok("No changes were made, as no new values were provided.");
        }

        repository.save(contacts);
        return ResponseEntity.ok("Contacts updated successfully!");
    }
}

