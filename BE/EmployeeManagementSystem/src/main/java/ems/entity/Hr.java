package ems.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hrs")
public class Hr {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    public Hr() {}

    public Hr(Long id, String name, User user) {
        this.id = id;
        this.name = name;
        this.user = user;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    @Override
    public String toString() {
        return "Hr{id=" + id + ", name='" + name + "', user=" + user.getUsername() + "}";
    }
}
