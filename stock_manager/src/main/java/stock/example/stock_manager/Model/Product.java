package stock.example.stock_manager.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String img;

    @Column(nullable = false)
    private String name;

    private String description;

    private double price;

    public Product() {
    }

    public Product(Long id, String img, String name,
                   String description, double price) {
        this.id = id;
        this.img = img;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    public Product(String img, String name,
                   String description, double price) {
        this.img = img;
        this.name = name;
        this.description = description;
        this.price = price;
    }

    // =========================
    // Getters & Setters
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}