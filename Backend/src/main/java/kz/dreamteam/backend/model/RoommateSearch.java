package kz.dreamteam.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;


@Entity
@Table(name = "roommate_search")
public class RoommateSearch {


    @Id
    @Column(name = "user_id") // Первичный ключ такой же, как в User
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id", nullable = false)
//    @JsonIgnore
    private User user;

    @Column(length = 50)
    private Integer searchStatus;

    @Column
    private Long budgetMin;

    @Column
    private Long budgetMax;

    @Column
    private LocalDate startDate;

    @Column
    private Integer scoreTest;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Integer getSearchStatus() {
        return searchStatus;
    }

    public void setSearchStatus(Integer searchStatus) {
        this.searchStatus = searchStatus;
    }

    public Long getBudgetMin() {
        return budgetMin;
    }

    public void setBudgetMin(Long budgetMin) {
        this.budgetMin = budgetMin;
    }

    public Long getBudgetMax() {
        return budgetMax;
    }

    public void setBudgetMax(Long budgetMax) {
        this.budgetMax = budgetMax;
    }

    public Integer getScoreTest() {
        return scoreTest;
    }

    public void setScoreTest(Integer scoreTest) {
        this.scoreTest = scoreTest;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }
}
