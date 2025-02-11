package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.UserMlQuestionsAnswers;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserMlQuestionsAnswersRepository extends JpaRepository<UserMlQuestionsAnswers, Long> {
    Optional<UserMlQuestionsAnswers> findByUserId(Long userId);
}

