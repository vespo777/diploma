package kz.dreamteam.backend.model;

import org.hibernate.annotations.Immutable;
import jakarta.persistence.*;

@Entity
@Immutable // Prevents updates/deletes
@Table(name = "interests")
public class Interest {

    @Id
    private Long id;
    private String name;

    public Interest() {}

    public Interest(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}

