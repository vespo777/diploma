package kz.dreamteam.backend.model;

import com.vladmihalcea.hibernate.type.array.IntArrayType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "ml_questions_answers")
public class MlQuestionsAnswers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @ElementCollection
    @CollectionTable(
        name = "ml_question_answer_values",
        joinColumns = @JoinColumn(name = "ml_questions_answers_id")
    )
    @Column(name = "answer_value")
    @OrderColumn(name = "answer_order")  // Важно! Сохраняет порядок элементов
    private List<Integer> questionsAnswers = new ArrayList<>();

    // Конструкторы, геттеры, сеттеры

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Integer> getQuestionsAnswers() {
        return questionsAnswers;
    }

    public void setQuestionsAnswers(List<Integer> questionsAnswers) {
        this.questionsAnswers = questionsAnswers;
    }
}

