package stock.example.stock_manager.Controller;


import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Request.OrderRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Model.Order;
import stock.example.stock_manager.Service.OrderService;

import java.util.List;

@RestController
@RequestMapping("/order")
@AllArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public APIResponse<Order>createOrder(@RequestBody OrderRequest request){
        return orderService.createOrder(request);
    }

    @GetMapping
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public APIResponse<Order> findOrderById(@PathVariable long id){
        return orderService.findOrderById(id);
    }

}
