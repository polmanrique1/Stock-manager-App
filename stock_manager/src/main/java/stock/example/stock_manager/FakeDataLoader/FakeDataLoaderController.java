package stock.example.stock_manager.FakeDataLoader;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor
@RequestMapping("/fake-data")
public class FakeDataLoaderController {

    private final FakeDataLoaderService fakeDataLoaderService;

    @PostMapping("/load")
    public ResponseEntity<String> loadFakeData() {

        fakeDataLoaderService.loadProducts();
        fakeDataLoaderService.loadWarehouses();

        return ResponseEntity.ok("Fake data loaded successfully");
    }
}