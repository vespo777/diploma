package kz.dreamteam.backend.model.dto;

public class UpdateRoommateSearchDto {
    private String searchStatus;
    private Long budgetMin;
    private Long budgetMax;
    private Integer scoreTest;

    // Default constructor
    public UpdateRoommateSearchDto() {
    }

    // Parameterized constructor
    public UpdateRoommateSearchDto(String searchStatus, Long budgetMin, Long budgetMax, Integer scoreTest) {
        this.searchStatus = searchStatus;
        this.budgetMin = budgetMin;
        this.budgetMax = budgetMax;
        this.scoreTest = scoreTest;
    }

    // Getters and Setters
    public String getSearchStatus() {
        return searchStatus;
    }

    public void setSearchStatus(String searchStatus) {
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
}

