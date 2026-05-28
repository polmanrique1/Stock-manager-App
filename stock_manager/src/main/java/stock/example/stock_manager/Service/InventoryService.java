package stock.example.stock_manager.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.DTO.Request.QuantityRequest;
import stock.example.stock_manager.Exception.ProductNotFoundException;
import stock.example.stock_manager.Exception.WarehouseNorFoundException;
import stock.example.stock_manager.Model.Inventory;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Model.Warehouse;
import stock.example.stock_manager.Repository.InventoryRepository;
import stock.example.stock_manager.Repository.ProductRepository;
import stock.example.stock_manager.Repository.WarehouseRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional(readOnly = true)
    public List<Inventory> getAllInventories(){
        return inventoryRepository.findAll();
    }

    /**
     * Devuelve los inventarios por id del producto
     * @param productId
     * @return
     */
    @Transactional(readOnly = true)
    public List<Inventory> getInventoriesByProductId(long productId){

        Product prod = productRepository.findById(productId).orElseThrow(() ->
                new ProductNotFoundException(productId)
        );

        return inventoryRepository.findByProduct(prod);
    }

    /**
     * Devuelve los inventarios de un almacén específico, lo que permite conocer la cantidad de cada producto disponible en ese almacén.
     * @param warehouseId
     * @return
     */
    @Transactional(readOnly = true)
    public List<Inventory> getInventoriesByWarehouseId(long warehouseId) {
        return inventoryRepository.findProductsByWarehouseId(warehouseId);
    }

    /**
     * Devuelve la cantidad de el producto por almacen
     * @param request
     * @return
     */
    @Transactional(readOnly = true)
    public int getProductQuantityInWarehouse(QuantityRequest request){

        Inventory inventory = inventoryRepository.findByProductIdAndWarehouseId(request.getProductID(), request.getWarehouseID())
                .orElseThrow(() -> new WarehouseNorFoundException("Inventory not found"));

        return inventory.getQuantity();
    }

    @Transactional(readOnly = true)
    public List<Inventory> getQuantityByWarehouseASC(long id) {
        return inventoryRepository.findProductsByWarehouseIdOrderByQuantityAsc(id);
    }

    @Transactional(readOnly = true)
    public List<Inventory> getQuantityByWarehouseDESC(long id) {
        return inventoryRepository.findProductsByWarehouseIdOrderByQuantityDesc(id);
    }
}
