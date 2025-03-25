//package kz.dreamteam.backend.repository;
//
//import kz.dreamteam.backend.model.Invitation;
//import kz.dreamteam.backend.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.Optional;
//
//public interface InvitationRepository extends JpaRepository<Invitation, Long> {
//    Optional<Invitation> findBySenderAndReceiver(User sender, User receiver);
//}
