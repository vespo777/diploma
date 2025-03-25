package kz.dreamteam.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // Первичный ключ такой же, как в User
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
//    @JsonManagedReference
    private User owner;

    @OneToMany(mappedBy = "team")
//    @JsonManagedReference
    private Set<User> members = new HashSet<>();

    private String name;

    public void addMember(User user) {
        members.add(user);
        user.setTeam(this); // Ensure bidirectional mapping
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Set<User> getMembers() {
        return members;
    }

    public void setMembers(Set<User> members) {
        this.members = members;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
