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
                    //Творческие хобби
                    new Interest(1L, "Фотография"),
                    new Interest(2L, "Создание видео и монтаж"),
                    new Interest(3L, "Игра на музыкальных инструментах"),
                    new Interest(4L, "Пение и вокал"),

                    //Физическая активность и спорт
                    new Interest(5L, "Йога")
//                    new Interest(5L, "Танцы (бальные, современные, народные)"),
//                    new Interest(5L, "Пешие походы"),
//                    new Interest(5L, "Командные виды спорта (футбол, баскетбол, волейбол)"),
//                    new Interest(5L, "Боевые искусства"),
//                    new Interest(5L, "Фитнес"),
//                    new Interest(5L, "Сноуборд/лыжи"),
//
//
//                    //Интеллектуальные увлечения
//                    new Interest(5L, "Чтение"),
//                    new Interest(5L, "Шахматы"),
//                    new Interest(5L, "Изучение иностранных языков"),
//                    new Interest(5L, "ICPC"),
//                    new Interest(5L, "Настольные игры"),
//                    new Interest(5L, "Наука и научные эксперименты"),
//                    new Interest(5L, "Робототехника")


            );

            for (Interest interest : predefinedInterests) {
                if (!repository.existsById(interest.getId())) {
                    repository.save(interest);
                }
            }
        };
    }
}
