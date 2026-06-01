package stock.example.stock_manager.Service;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.DTO.Request.WarehouseRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Exception.WarehouseNorFoundException;
import stock.example.stock_manager.Exception.WarehouseValidationException;
import stock.example.stock_manager.Model.Warehouse;
import stock.example.stock_manager.Repository.WarehouseRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class WarehouseService {

    private  final WarehouseRepository warehouseRepository;

    @Transactional
    public APIResponse<Warehouse> createWarehouse(WarehouseRequest request){

        validateRequest(request);

        Warehouse newWarehouse = new Warehouse();
        newWarehouse.setContactMail(request.getContactMail());
        newWarehouse.setName(request.getName());
        newWarehouse.setLocation(request.getLocation());
        newWarehouse.setPhoneNumber(request.getPhoneNumber());

        warehouseRepository.save(newWarehouse);

        return  new APIResponse<>("Warehouse added successfully",newWarehouse);
    }

    @Transactional(readOnly = true)
    public List<Warehouse>getAllWarehouses(){
        return warehouseRepository.findAll();
    }

    @Transactional(readOnly = true)
    public  APIResponse<Warehouse>findWarehouseById(long id){

        Warehouse warehouse = warehouseRepository.findById(id).orElseThrow(()->
                new WarehouseNorFoundException("Warehouse not found")
                );

        return new APIResponse<>("Warehouse found successfully", warehouse);
    }

    @Transactional
    public  APIResponse<Warehouse>deleteWarehouse(long id){

        Warehouse warehouse = warehouseRepository.findById(id).orElseThrow(()->
                new WarehouseNorFoundException("Warehouse not found")
        );

        warehouseRepository.delete(warehouse);

        return new APIResponse<>("Warehouse deleted successfully", warehouse);
    }

    private void validateRequest(WarehouseRequest warehouseRequest){
        if (warehouseRequest == null) {
            throw new WarehouseValidationException("Warehouse request cannot be null");
        }
        if (warehouseRequest.getName() == null || warehouseRequest.getName().isBlank()) {
            throw new WarehouseValidationException("Warehouse name is required");
        }
        if (warehouseRequest.getLocation() == null || warehouseRequest.getLocation().isBlank()) {
            throw new WarehouseValidationException("Warehouse location is required");
        }
        if (warehouseRequest.getPhoneNumber() == null || warehouseRequest.getPhoneNumber().isBlank()) {
            throw new WarehouseValidationException("Phone number is required");
        }
        if (!warehouseRequest.getPhoneNumber().matches("^[+]?[0-9]{10,15}$")) {
            throw new WarehouseValidationException("Invalid phone number format. Must be 10-15 digits, optionally starting with +");
        }
        if (warehouseRequest.getContactMail() == null || warehouseRequest.getContactMail().isBlank()) {
            throw new WarehouseValidationException("Contact email is required");
        }
        if (!warehouseRequest.getContactMail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new WarehouseValidationException("Invalid email format");
        }
    }

}
