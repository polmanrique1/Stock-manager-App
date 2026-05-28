package stock.example.stock_manager.Service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import stock.example.stock_manager.Model.Order;
import stock.example.stock_manager.Model.Product;
import stock.example.stock_manager.Repository.OrderRepository;
import stock.example.stock_manager.Repository.ProductRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class DocumentGeneratorService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public ResponseEntity<byte[]> downloadPDFOrderHistory() throws IOException {

        List<Order> orders = orderRepository.findAll();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // ===== HEADER =====
        Paragraph header = new Paragraph("ORDER HISTORY REPORT")
                .setBold()
                .setFontSize(18);

        document.add(header);

        document.add(new Paragraph("")
                .setBorderBottom(new SolidBorder(1))
                .setMarginBottom(15));

        // ===== BODY =====
        for (Order order : orders) {

            document.add(new Paragraph("Order #" + order.getId())
                    .setBold()
                    .setFontSize(14));

            document.add(new Paragraph("Type: " + order.getMovementData().getType()));
            document.add(new Paragraph("Priority: " + order.getPriority()));

            // Product
            Optional<Product> prodOpt = productRepository.findById(order.getMovementData().getProductId());

            String productName = prodOpt
                    .map(Product::getName)
                    .orElse("Unknown product");

            document.add(new Paragraph("Product: " + productName));

            // User
            document.add(new Paragraph(
                    "User: " + order.getUserResponsable().getUsername() +
                            " | Email: " + order.getUserResponsable().getEmail()
            ));

            // Date
            document.add(new Paragraph("Date: " + order.getOrderDate()));

            // separator
            document.add(new Paragraph("")
                    .setBorderBottom(new SolidBorder(0.5f))
                    .setMarginTop(10)
                    .setMarginBottom(10));
        }

        document.close();

        byte[] pdfBytes = baos.toByteArray();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order-history.pdf")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}