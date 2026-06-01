package stock.example.stock_manager.Controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import stock.example.stock_manager.Model.Order;
import stock.example.stock_manager.Service.OrderProcesserService;

@RestController
@RequestMapping("/orderProcess")
@AllArgsConstructor
public class OrderProcessingController {

    private final OrderProcesserService orderProcesserService;

    @PostMapping("/accept/{id}")
    public void acceptOrder(@PathVariable long id){
        orderProcesserService.acceptOrder(id);
    }

    @PostMapping("reject/{id}")
    public void denyOrder(@PathVariable long id){
        orderProcesserService.rejectOrder(id);
    }
}
