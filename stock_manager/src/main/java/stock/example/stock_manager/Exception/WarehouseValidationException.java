package stock.example.stock_manager.Exception;

public class WarehouseValidationException extends RuntimeException{

    public WarehouseValidationException(String message){
        super(message);
    }
}
