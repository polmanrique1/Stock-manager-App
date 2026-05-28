package stock.example.stock_manager.Service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Exception.OrderAcceptedException;
import stock.example.stock_manager.Model.Order;
import stock.example.stock_manager.Repository.OrderRepository;

@Service
@AllArgsConstructor
public class OrderProcesserService {

    private final OrderRepository orderRepository;
    private final MovementService movementService;

    @Transactional
    public APIResponse<Order> acceptOrder(long id){

        Order getOrder = orderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (getOrder.getMovementData() == null) {
            throw new RuntimeException("Order has no movement data");
        }

        String type = getOrder.getMovementData().getType();

        if ("sell".equals(type)) {
            movementService.createSellMovement(getOrder.getMovementData());

        } else if ("addition".equals(type)) {
            movementService.additionMovement(getOrder.getMovementData());

        } else if ("transfer".equals(type)) {
            movementService.transferMovement(getOrder.getMovementData());

        } else {
            throw new RuntimeException("Invalid movement type");
        }

        if (getOrder.isAccepted()) {
            throw new OrderAcceptedException("Order has already been accepted");
        }

        getOrder.setAccepted(true);

        Order saved = orderRepository.save(getOrder);

        return new APIResponse<>("Order accepted successfully", saved);
    }

    @Transactional
    public APIResponse<Order> rejectOrder(long id){

        Order getOrder = orderRepository.findByIdWithLock(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderRepository.delete(getOrder);

        return new APIResponse<>("Order rejected successfully", null);
    }
}
