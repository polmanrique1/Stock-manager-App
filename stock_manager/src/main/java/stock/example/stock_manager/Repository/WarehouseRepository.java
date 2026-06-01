package stock.example.stock_manager.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stock.example.stock_manager.Model.Warehouse;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {

}
