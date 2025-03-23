//package kz.dreamteam.backend.service;
//
//import kz.dreamteam.backend.model.Invitation;
//import kz.dreamteam.backend.model.InvitationStatus;
//import kz.dreamteam.backend.model.User;
//import kz.dreamteam.backend.repository.InvitationRepository;
//import kz.dreamteam.backend.repository.UserRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class InvitationService {
//
//    private final UserRepository userRepository;
//    private final InvitationRepository invitationRepository;
//
//    public InvitationService(UserRepository userRepository, InvitationRepository invitationRepository) {
//        this.userRepository = userRepository;
//        this.invitationRepository = invitationRepository;
//    }
//
//    public String sendInvitation(Long senderId, Long receiverId) {
//        User sender = userRepository.findById(senderId)
//                .orElseThrow(() -> new RuntimeException("Sender not found"));
//        User receiver = userRepository.findById(receiverId)
//                .orElseThrow(() -> new RuntimeException("Receiver not found"));
//
//        // Check if invitation already exists
//        Optional<Invitation> existingInvitation = invitationRepository.findBySenderAndReceiver(sender, receiver);
//        if (existingInvitation.isPresent()) {
//            return "Invitation already sent.";
//        }
//
//        // Create a new invitation
//        Invitation invitation = new Invitation();
//        invitation.setSender(sender);
//        invitation.setReceiver(receiver);
//        invitation.setStatus(InvitationStatus.PENDING);
//
//        invitationRepository.save(invitation);
//        return "Invitation sent successfully.";
//    }
//
//    public String respondToInvitation(Long senderId, Long receiverId, boolean accept) {
//        Invitation invitation = invitationRepository.findBySenderAndReceiver(
//                userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found")),
//                userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"))
//        ).orElseThrow(() -> new RuntimeException("Invitation not found"));
//
//        if (accept) {
//            invitation.setStatus(InvitationStatus.ACCEPTED);
//            invitationRepository.save(invitation);
//            return "Connection accepted successfully.";
//        } else {
//            invitation.setStatus(InvitationStatus.DECLINED);
//            invitationRepository.save(invitation);
//            return "Connection declined successfully.";
//        }
//    }
//}
//
