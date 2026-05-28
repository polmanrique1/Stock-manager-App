package stock.example.stock_manager.FakeDataLoader;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Model.Warehouse;
import stock.example.stock_manager.Repository.ProductRepository;
import stock.example.stock_manager.Repository.WarehouseRepository;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class FakeDataLoaderService {

    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    // =========================
    // PRODUCTS
    // =========================
    public List<Product> loadProducts() {

        if (productRepository.count() > 0) {
            return productRepository.findAll();
        }

        List<Product> products = new ArrayList<>();

        for (int i = 1; i <= 20; i++) {

            Product product = new Product(
                    "https://picsum.photos/200?random=" + i,
                    "Product " + i,
                    "Description for product " + i,
                    Math.round((10 + Math.random() * 90) * 100.0) / 100.0
            );

            products.add(product);
        }

        return productRepository.saveAll(products);
    }

    // =========================
    // WAREHOUSES
    // =========================
    public List<Warehouse> loadWarehouses() {

        if (warehouseRepository.count() > 0) {
            return warehouseRepository.findAll();
        }

        List<Warehouse> warehouses = new ArrayList<>();

        String[] cities = {
                "Barcelona", "Madrid", "Valencia", "Sevilla", "Bilbao",
                "Zaragoza", "Málaga", "Murcia", "Alicante", "Granada",
                "Tarragona", "Girona", "Lleida", "A Coruña", "Vigo",
                "Salamanca", "Toledo", "Pamplona", "Oviedo", "Córdoba"
        };

        for (int i = 1; i <= 20; i++) {

            Warehouse warehouse = new Warehouse(
                    "warehouse" + i + "@stock.com",
                    "+34 600 000 " + String.format("%03d", i),
                    cities[i - 1],
                    "Warehouse " + i,
                    0L
            );

            warehouses.add(warehouse);
        }

        return warehouseRepository.saveAll(warehouses);
    }
}