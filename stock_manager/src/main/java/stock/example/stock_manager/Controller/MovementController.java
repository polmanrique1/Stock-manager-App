package stock.example.stock_manager.Controller;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Request.MovementRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Model.Movement;
import stock.example.stock_manager.Service.MovementService;

import java.util.List;

@RestController
@RequestMapping("/movement")
@AllArgsConstructor
public class MovementController {

    private final MovementService movementService;

    @GetMapping
    public List<Movement>getAllMovements(){
        return movementService.getALlMovements();
    }

    @GetMapping("/recent")
    public List<Movement>getRecentMovements(){
        return  movementService.getMovementsThisWeek();
    }


}
