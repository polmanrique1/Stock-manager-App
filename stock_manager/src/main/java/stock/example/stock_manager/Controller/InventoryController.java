package stock.example.stock_manager.Controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Request.QuantityRequest;
import stock.example.stock_manager.Model.Inventory;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Service.InventoryService;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public List<Inventory>getAllInventories(){
        return inventoryService.getAllInventories();
    }

    public List<Inventory>getInventoriesByProductId(@PathVariable long productId){
        return inventoryService.getInventoriesByProductId(productId);
    }

    @GetMapping("{warehouseId}")
    public List<Inventory> getInventoriesByWarehouseId(@PathVariable long warehouseId) {
        return inventoryService.getInventoriesByWarehouseId(warehouseId);
    }

    public int getProductQuantityInWarehouse(@RequestBody QuantityRequest request){
        return inventoryService.getProductQuantityInWarehouse(request);
    }
    @GetMapping("{warehouseId}/qnt/asc")
    public List<Inventory> getQuantityByWarehouseASC(@PathVariable long warehouseId) {
        return inventoryService.getQuantityByWarehouseASC(warehouseId);
    }

    @GetMapping("{warehouseId}/qnt/desc")
    public List<Inventory> getQuantityByWarehouseDESC(@PathVariable long warehouseId) {
        return inventoryService.getQuantityByWarehouseDESC(warehouseId);
    }

    @GetMapping("warehouse/{id}")
    public List<String>findWarehousesWithProductInStock(@PathVariable long id){
        return inventoryService.findWarehousesWithProductInStock(id);
    }
}
