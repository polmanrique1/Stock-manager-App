package stock.example.stock_manager.DTO.Response;

import lombok.Data;

@Data
public class APIResponse<T> {

    private String message;
    private T data;

    public APIResponse() {
    }

    public APIResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }
}
