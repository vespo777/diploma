package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.MlQuestionsAnswers;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MlQuestionsAnswersRepository extends JpaRepository<MlQuestionsAnswers, Long> {
    Optional<MlQuestionsAnswers> findByUserId(Long userId);
}

