package kz.dreamteam.backend.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

@Service
public class StartupService {
    private final ApartmentService apartmentService;

    public StartupService(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @PostConstruct
    public void init() {
        apartmentService.createIndexIfNotExists("apartments");
    }
}

