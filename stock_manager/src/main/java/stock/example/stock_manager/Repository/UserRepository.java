package stock.example.stock_manager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stock.example.stock_manager.Model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
}
