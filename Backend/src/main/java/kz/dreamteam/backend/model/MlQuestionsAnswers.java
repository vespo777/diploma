package kz.dreamteam.backend.model;

import com.vladmihalcea.hibernate.type.array.IntArrayType;
import jakarta.persistence.*;
import org.hibernate.annotations.Type;

@Entity
@Table(name = "ml_questions_answers")
public class MlQuestionsAnswers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // @Type(IntArrayType.class)
    @Column(name = "questions_answers", columnDefinition = "integer[]")
    private Integer[] questionsAnswers; // PostgreSQL массив

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

    public Integer[] getQuestionsAnswers() {
        return questionsAnswers;
    }

    public void setQuestionsAnswers(Integer[] questionsAnswers) {
        this.questionsAnswers = questionsAnswers;
    }
}

