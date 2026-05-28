package stock.example.stock_manager.Exception;

public class OrderAcceptedException extends RuntimeException{

    public OrderAcceptedException(String message) {
        super(message);
    }
}
