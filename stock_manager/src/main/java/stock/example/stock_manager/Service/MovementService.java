package stock.example.stock_manager.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Exception.*;
import stock.example.stock_manager.Model.*;
import stock.example.stock_manager.Repository.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@AllArgsConstructor
public class MovementService {

    private final MovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;

    @Transactional
    public APIResponse<Movement> createSellMovement(MovementData data){

        if (!"sell".equals(data.getType())){
            throw new WrongMovementTypeException("This is not a sell movement");
        }

        if(data.getQuantity() <= 0){
            throw new UnableToUpdateException("Quantity must be positive");
        }

        Product product = productExistsValidation(data.getProductId());

        Warehouse warehouse = warehouseRepository
                .findById(data.getSourceWarehouseId())
                .orElseThrow(() ->
                        new WarehouseNorFoundException("Warehouse not found")
                );

        Inventory inventory = inventoryRepository
                .findByProductAndWarehouseWithLock(product, warehouse)
                .orElseThrow(() ->
                        new UnableToUpdateException("No stock found in warehouse")
                );

        if(inventory.getQuantity() < data.getQuantity()){
            throw new UnableToUpdateException("Insufficient stock");
        }

        inventory.setQuantity(inventory.getQuantity() - data.getQuantity());
        inventoryRepository.save(inventory);

        Movement newMove = new Movement();
        newMove.setType(data.getType());
        newMove.setProduct(product);

        Movement savedMove = movementRepository.save(newMove);

        return new APIResponse<>("Sell done successfully", savedMove);
    }

    @Transactional
    public APIResponse<Movement> additionMovement(MovementData data){

        if(!"addition".equals(data.getType())){
            throw new WrongMovementTypeException("This is not an addition movement");
        }

        if(data.getQuantity() <= 0){
            throw new UnableToUpdateException("Quantity must be positive");
        }

        Product product = productExistsValidation(data.getProductId());

        Warehouse warehouse = warehouseRepository.findById(data.getSourceWarehouseId())
                .orElseThrow(() ->
                        new WarehouseNorFoundException("Warehouse not found")
                );

        // Search for the inventory in the db with a pessimistic lock to avoid concurrent updates
        Inventory inventory = inventoryRepository.findByProductAndWarehouseWithLock(product, warehouse).orElse(null);

        if(inventory == null){
            inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setWarehouse(warehouse);
            inventory.setQuantity(data.getQuantity());
        } else {
            inventory.setQuantity(inventory.getQuantity() + data.getQuantity());
        }

        inventoryRepository.save(inventory);

        Movement newMove = new Movement();
        newMove.setType(data.getType());
        newMove.setProduct(product);

        Movement savedMove = movementRepository.save(newMove);

        return new APIResponse<>("Addition done successfully", savedMove);
    }

    @Transactional
    public APIResponse<Movement> transferMovement(MovementData data) {

        if (!"transfer".equals(data.getType())) {
            throw new WrongMovementTypeException("This is not a transfer movement");
        }

        if (data.getQuantity() <= 0) {
            throw new UnableToUpdateException("Quantity must be positive");
        }

        Warehouse sourceWarehouse = warehouseRepository.findById(data.getSourceWarehouseId())
                .orElseThrow(() -> new WarehouseNorFoundException("Source warehouse not found"));

        Warehouse destinationWarehouse = warehouseRepository.findById(data.getDestinationWarehouseId())
                .orElseThrow(() -> new WarehouseNorFoundException("Destination warehouse not found"));

        Product product = productRepository.findById(data.getProductId())
                .orElseThrow(() -> new ProductNotFoundException(data.getProductId()));

        Inventory sourceInventory = inventoryRepository
                .findByProductAndWarehouse(product, sourceWarehouse)
                .orElseThrow(() -> new UnableToUpdateException("No stock in source warehouse"));

        if (sourceInventory.getQuantity() < data.getQuantity()) {
            throw new UnableToUpdateException("Insufficient stock");
        }

        Inventory destinationInventory = inventoryRepository
                .findByProductAndWarehouse(product, destinationWarehouse)
                .orElse(null);

        // Actualizar cantidades
        sourceInventory.setQuantity(sourceInventory.getQuantity() - data.getQuantity());

        if (destinationInventory == null) {
            destinationInventory = new Inventory();
            destinationInventory.setProduct(product);
            destinationInventory.setWarehouse(destinationWarehouse);
            destinationInventory.setQuantity(data.getQuantity());
            inventoryRepository.save(destinationInventory); // ✅ Guardar nuevo inventory
        } else {
            destinationInventory.setQuantity(destinationInventory.getQuantity() + data.getQuantity());
            // ✅ No necesita save() porque ya está gestionada, pero explícito no duele
        }

        // ✅ Guardar explícitamente los cambios
        inventoryRepository.save(sourceInventory);

        // Si destinationInventory ya existe y está gestionada, Hibernate detectará el cambio
        // Pero por seguridad, si no es nueva, también la guardamos
        if (destinationInventory.getId() != null) {
            inventoryRepository.save(destinationInventory);
        }

        Movement movement = new Movement();
        movement.setType("transfer");
        movement.setProduct(product);

        Movement savedMovement = movementRepository.save(movement);

        return new APIResponse<>("Warehouse transfer completed successfully", savedMovement);
    }
    @Transactional(readOnly = true)
    public List<Movement> getALlMovements(){
        return movementRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Movement> getMovementsThisWeek(){

        LocalDateTime startOfWeek = LocalDate.now()
                .with(DayOfWeek.MONDAY)
                .atStartOfDay();

        LocalDateTime endOfWeek = LocalDate.now()
                .with(DayOfWeek.SUNDAY)
                .atTime(LocalTime.MAX);

        return movementRepository.findMovementsThisWeek(startOfWeek, endOfWeek);
    }

    private Product productExistsValidation(Long id){
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new ProductNotFoundException(id)
                );
    }
}