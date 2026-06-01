package stock.example.stock_manager.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stock.example.stock_manager.DTO.Response.JWTResponse;
import stock.example.stock_manager.DTO.Request.LoginRequest;
import stock.example.stock_manager.DTO.Request.RegisterRequest;
import stock.example.stock_manager.DTO.Response.UserInfoResponse;
import stock.example.stock_manager.Service.UserService;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService authService;

    @PostMapping("/login")
    public ResponseEntity<JWTResponse> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<JWTResponse> register(@RequestBody RegisterRequest registerRequest){
        return ResponseEntity.ok(authService.register(registerRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> getUserInfo(){
        return ResponseEntity.ok(authService.getUserLogged());
    }
}
