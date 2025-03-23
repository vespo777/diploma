package kz.dreamteam.backend.repository;

import kz.dreamteam.backend.model.Team;
import kz.dreamteam.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TeamRepository extends JpaRepository<Team, Long> {

    @Query("SELECT t FROM Team t WHERE t.owner.id = :userId")
    Optional<Team> findByOwnerId(@Param("userId") Long userId);

    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    Optional<Team> findByMemberId(@Param("userId") Long userId);

    @Query("SELECT t.members FROM Team t WHERE t.id = :teamId")
    List<User> findTeammatesByTeamId(@Param("teamId") Long teamId);
    @Query("SELECT t FROM Team t JOIN t.members m WHERE m.id = :userId")
    Optional<Team> findTeamByMemberId(@Param("teamId") Long userId);
}
