package stock.example.stock_manager.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import stock.example.stock_manager.DTO.Request.ProductRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Exception.ProductNotFoundException;
import stock.example.stock_manager.Exception.ProductValidationException;
import stock.example.stock_manager.Exception.WarehouseNorFoundException;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Model.Warehouse;
import stock.example.stock_manager.Repository.ProductRepository;
import org.springframework.transaction.annotation.Transactional;
import stock.example.stock_manager.Repository.WarehouseRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    @Transactional
    public APIResponse<Product> createProduct(ProductRequest request){

        Product newProd = new Product();

        validateRequest(request);

        newProd.setName(request.getName());
        newProd.setDescription(request.getDescription());
        newProd.setPrice(request.getPrice());
        newProd.setImg(request.getImg());

        productRepository.save(newProd);

        return new APIResponse<Product>("Product saved successfully",newProd);
    }

    @Transactional(readOnly = true)
    public List<Product> getAllProducts(){
        return productRepository.findAll();
    }

    @Transactional
    public  APIResponse<Product> deleteProduct(Long id){
        Product prodToDelete = productRepository.findById(id).orElseThrow(() ->
                new ProductNotFoundException(id));

        productRepository.delete(prodToDelete);
        return new APIResponse<Product>("Product deleted successfully",prodToDelete);
    }

    @Transactional(readOnly = true)
    public APIResponse<Product> findById(Long id){
        Product prod = productRepository.findById(id).orElseThrow(() ->
                new ProductNotFoundException(id));

        return new APIResponse<>("Product found",prod);
    }

    @Transactional(readOnly = true)
    public List<Product>ordedByExpensive(){
        return productRepository.findAllOrderByPriceAsc();
    }

    @Transactional(readOnly = true)
    public List<Product>ordedByCheapest(){
        return productRepository.findAllOrderByPriceDesc();
    }


    private void validateRequest(ProductRequest request){
        if (request == null) {
            throw new ProductValidationException("Request can't be null");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ProductValidationException("Name is required");
        }
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new ProductValidationException("Description is required");
        }
        if (request.getImg() == null || request.getImg().isBlank()) {
            throw new ProductValidationException("Image URL is required");
        }
        if (request.getPrice() <= 0) {
            throw new ProductValidationException("Price must be greater than 0");
        }
    }
}