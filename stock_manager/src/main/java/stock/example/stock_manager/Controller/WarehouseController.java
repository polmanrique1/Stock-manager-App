package stock.example.stock_manager.Controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Request.WarehouseRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Model.Warehouse;
import stock.example.stock_manager.Service.WarehouseService;

import java.util.List;

@RestController
@RequestMapping("/warehouse")
@AllArgsConstructor
public class WarehouseController {

    private final WarehouseService warehouseService;

    @PostMapping
    public APIResponse<Warehouse> addWarehouse(@RequestBody WarehouseRequest request){
        return warehouseService.createWarehouse(request);
    }

    @GetMapping("/{id}")
    public APIResponse<Warehouse> getWarehouseById(long id){
        return warehouseService.findWarehouseById(id);
    }

     @DeleteMapping("/{id}")
     public APIResponse<Warehouse> deleteWarehouse(long id){
        return warehouseService.deleteWarehouse(id);
     }

     @GetMapping
     public List<Warehouse> getAllWarehouses(){
        return warehouseService.getAllWarehouses();
     }
}
