package stock.example.stock_manager.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseRequest {
    private String name;
    private String location;
    private String phoneNumber;
    private String contactMail;
}
