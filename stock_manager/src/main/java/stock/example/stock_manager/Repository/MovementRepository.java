package stock.example.stock_manager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import stock.example.stock_manager.Model.Movement;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovementRepository extends JpaRepository<Movement, Long> {

    @Query("""
    SELECT m
    FROM Movement m
    WHERE m.date BETWEEN :startDate AND :endDate
    ORDER BY m.date DESC
""")
    List<Movement> findMovementsThisWeek(LocalDateTime startDate, LocalDateTime endDate);

}
