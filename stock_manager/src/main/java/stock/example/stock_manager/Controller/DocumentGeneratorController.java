package stock.example.stock_manager.Controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.Service.DocumentGeneratorService;

import java.io.IOException;

@RestController
@AllArgsConstructor
@RequestMapping("/document")
public class DocumentGeneratorController {

    private final DocumentGeneratorService documentGeneratorService;

    @GetMapping("/orderHistory")
    public ResponseEntity<byte[]> generateOrderHistory() throws IOException {
        return documentGeneratorService.downloadPDFOrderHistory();
    }
}