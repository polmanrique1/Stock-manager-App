package stock.example.stock_manager.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.DTO.Request.OrderRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Exception.UserNotFoundException;
import stock.example.stock_manager.Model.MovementData;
import stock.example.stock_manager.Model.Order;
import stock.example.stock_manager.Model.User;
import stock.example.stock_manager.Repository.OrderRepository;
import stock.example.stock_manager.Repository.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional
    public APIResponse<Order> createOrder(OrderRequest request){

        Order newOrder = new Order();

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new UserNotFoundException("User not found")
                );

        newOrder.setPriority(request.getPriority());
        newOrder.setUserResponsable(user);

        MovementData movementData = MovementData.builder()
                .type(request.getMovement().getType())
                .productId(request.getMovement().getProductId())
                .sourceWarehouseId(request.getMovement().getSourceWarehouseId())
                .destinationWarehouseId(request.getMovement().getDestinationWarehouseId())
                .quantity(request.getMovement().getQuantity())
                .build();

        newOrder.setMovementData(movementData);

        Order savedOrder = orderRepository.save(newOrder);

        return new APIResponse<>("Order created successfully", savedOrder);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public APIResponse<Order> findOrderById(long id){

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found")
                );

        return new APIResponse<>("Order found successfully", order);
    }
}
