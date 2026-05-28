package stock.example.stock_manager.Model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name ="orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String priority;

    @Embedded
    private MovementData movementData;

    @ManyToOne
    @JoinColumn(name = "user_responsable_id")
    private User userResponsable;

    private boolean accepted = false;

    private LocalDateTime orderDate;

    public Order() {
    }

    @PrePersist
    public void prePersist() {
        this.accepted = false;
        this.orderDate = LocalDateTime.now();
    }

    public Order(Long id, String priority, MovementData movementData, User userResponsable) {
        this.id = id;
        this.priority = priority;
        this.movementData = movementData;
        this.userResponsable = userResponsable;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public MovementData getMovementData() {
        return movementData;
    }

    public void setMovementData(MovementData movementData) {
        this.movementData = movementData;
    }

    public User getUserResponsable() {
        return userResponsable;
    }

    public void setUserResponsable(User userResponsable) {
        this.userResponsable = userResponsable;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}