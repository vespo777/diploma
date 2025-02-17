package kz.dreamteam.backend.configuration;

import kz.dreamteam.backend.model.Interest;
import kz.dreamteam.backend.repository.InterestsRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;

import java.util.Arrays;
import java.util.List;

public class InterestsInitilizer {
    @Bean
    public CommandLineRunner loadData(InterestsRepository repository) {
        return args -> {
            List<Interest> predefinedInterests = Arrays.asList(
                    new Interest(1L, "Football"),
                    new Interest(2L, "Basketball"),
                    new Interest(3L, "Reading"),
                    new Interest(4L, "Traveling"),
                    new Interest(5L, "ICPC")
            );

            for (Interest interest : predefinedInterests) {
                if (!repository.existsById(interest.getId())) {
                    repository.save(interest);
                }
            }
        };
    }
}
