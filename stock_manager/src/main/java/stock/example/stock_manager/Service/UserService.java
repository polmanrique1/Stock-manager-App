package stock.example.stock_manager.Service;


import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import stock.example.stock_manager.DTO.Response.JWTResponse;
import stock.example.stock_manager.DTO.Request.LoginRequest;
import stock.example.stock_manager.DTO.Request.RegisterRequest;
import stock.example.stock_manager.DTO.Response.UserInfoResponse;
import stock.example.stock_manager.JWT.JWTService;
import stock.example.stock_manager.Model.User;
import stock.example.stock_manager.Repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    public JWTResponse login(LoginRequest loginRequest){

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);

        return JWTResponse.builder().token(token).build();
    }

    public JWTResponse register(RegisterRequest registerRequest) {


        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEmail(registerRequest.getMail());


        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser);

        return JWTResponse.builder()
                .token(token)
                .build();
    }

    public UserInfoResponse getUserLogged(){

        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado: " + username));


        return UserInfoResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }


}
