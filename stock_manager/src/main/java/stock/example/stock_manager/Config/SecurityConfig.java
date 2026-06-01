package stock.example.stock_manager.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import stock.example.stock_manager.JWT.JWTAuthFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthenticationProvider authProvider;
    private final JWTAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        return http

                // DESACTIVAR CSRF
                .csrf(csrf -> csrf.disable())

                // USAR CorsConfig
                .cors(cors -> {})

                // RUTAS
                .authorizeHttpRequests(auth -> auth

                        // PREFLIGHT
                        .requestMatchers(HttpMethod.OPTIONS, "/**")
                        .permitAll()

                        // PÚBLICAS
                        .requestMatchers(
                                "/auth/**",
                                "/h2-console/**"
                        ).permitAll()

                        // PRIVADAS
                        .requestMatchers(
                                "/wallet/**",
                                "/transaction/**"
                        ).authenticated()

                        // RESTO
                        .anyRequest().authenticated()
                )

                // H2 CONSOLE
                .headers(headers ->
                        headers.frameOptions(frame -> frame.disable())
                )

                // JWT STATELESS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // AUTH PROVIDER
                .authenticationProvider(authProvider)

                // JWT FILTER
                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }
}