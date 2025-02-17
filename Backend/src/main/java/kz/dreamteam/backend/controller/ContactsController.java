package kz.dreamteam.backend.controller;

import kz.dreamteam.backend.model.dto.UpdateContactsDto;
import kz.dreamteam.backend.service.ContactsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class ContactsController {

    private final ContactsService service;

    public ContactsController(ContactsService service) {
        this.service = service;
    }

    @PutMapping("/contacts/{userId}")
    public ResponseEntity<String> updateContacts(
            @PathVariable Long userId,
            @RequestBody UpdateContactsDto dto) {
        return service.updateContacts(userId, dto);
    }
}

