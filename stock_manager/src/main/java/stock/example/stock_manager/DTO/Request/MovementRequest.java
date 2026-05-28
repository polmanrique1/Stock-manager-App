package stock.example.stock_manager.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovementRequest {

    private String type;

    private Long productId;

    private Long sourceWarehouseId;

    private Long destinationWarehouseId;

    private int quantity;
}