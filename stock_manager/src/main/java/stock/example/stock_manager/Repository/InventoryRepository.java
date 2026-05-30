package stock.example.stock_manager.Repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import stock.example.stock_manager.Model.Inventory;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Model.Warehouse;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository
        extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByProductAndWarehouse(Product product, Warehouse warehouse);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT i
    FROM Inventory i
    WHERE i.product = :product
    AND i.warehouse = :warehouse
""")
    Optional<Inventory> findByProductAndWarehouseWithLock(
            Product product,
            Warehouse warehouse
    );

    List<Inventory> findByProduct(Product product);


    @Query("""
    SELECT i
    FROM Inventory i
    WHERE i.warehouse.id = :warehouseId
""")
    List<Inventory> findProductsByWarehouseId(Long warehouseId);


    boolean existsByProductAndWarehouse(Product product, Warehouse warehouse);

    Optional<Inventory> findByProductIdAndWarehouseId(Long productId, Long warehouseId);

    @Query("""
    SELECT i
    FROM Inventory i
    WHERE i.warehouse.id = :warehouseId
    ORDER BY i.quantity DESC
""")
    List<Inventory> findProductsByWarehouseIdOrderByQuantityDesc(Long warehouseId);

    @Query("""
    SELECT i
    FROM Inventory i
    WHERE i.warehouse.id = :warehouseId
    ORDER BY i.quantity ASC
""")
    List<Inventory> findProductsByWarehouseIdOrderByQuantityAsc(Long warehouseId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT i
    FROM Inventory i
    WHERE i.product = :product
    AND i.warehouse = :warehouse
""")
    Optional<Inventory> findByProductAndWarehouseForUpdate(
            @Param("product") Product product,
            @Param("warehouse") Warehouse warehouse
    );


    @Query("""
    SELECT w.name
    FROM Inventory y
    INNER JOIN Warehouses w ON w.id = y.warehouse.id
    WHERE y.product.id = :productId
    """)
    List<String> findWarehousesWithProductInStock(@Param("productId") Long productId);
}