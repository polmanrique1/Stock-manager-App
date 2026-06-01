package stock.example.stock_manager.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Request.ProductRequest;
import stock.example.stock_manager.DTO.Response.APIResponse;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts(){
        return productService.getAllProducts();
    }

    @PostMapping
    public APIResponse<Product> addProduct(@RequestBody ProductRequest request){
        return productService.createProduct(request);
    }

    @GetMapping("/{id}")
    public APIResponse<Product> getProductById(@PathVariable Long id){
        return productService.findById(id);
    }

    @DeleteMapping("/{id}")
    public APIResponse<Product> deleteProduct(@PathVariable Long id){
        return productService.deleteProduct(id);
    }

    @GetMapping("/price/asc")
    public List<Product> getAllProductsOrdedByPriceASC(){
        return productService.ordedByExpensive();
    }

    @GetMapping("/price/desc")
    public List<Product> getAllProductsOrdedByPriceDESC(){
        return productService.ordedByCheapest();
    }



}
