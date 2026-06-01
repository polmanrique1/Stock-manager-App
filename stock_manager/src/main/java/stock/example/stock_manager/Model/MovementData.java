package stock.example.stock_manager.Model;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MovementData {

    private String type;

    private Long productId;

    private Long sourceWarehouseId;

    private Long destinationWarehouseId;

    private int quantity;
}