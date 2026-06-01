package stock.example.stock_manager.Exception;

public class WrongMovementTypeException extends RuntimeException{

    public WrongMovementTypeException(String message){
        super(message);
    }
}
