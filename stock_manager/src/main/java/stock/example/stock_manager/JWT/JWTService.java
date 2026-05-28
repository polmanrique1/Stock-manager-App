package stock.example.stock_manager.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import stock.example.stock_manager.Model.User;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JWTService {
    private static final String SECRET_KEY = "ZmFrZXNlY3JldGtleWZvcmp3dGVzdGluZ2FsbGVycmVkb3IxMjM0NTY=";

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", user.getUsername());
        claims.put("email", user.getEmail());
        return buildToken(claims, user.getUsername());
    }


    private String buildToken(Map<String, Object> claims, String subject) {
        long expirationTime = 1000 * 60 * 60;
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }


    public String getUsernameFromToken(String token) {
        return getClaims(token, Claims::getSubject);
    }


    private Claims getAllClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    public <T> T getClaims(String token, Function<Claims, T> claimsResolver){
        final Claims claims = getAllClaims(token);
        return claimsResolver.apply(claims);
    }


    public Date getExpirationDate(String token){
        return getClaims(token, Claims::getExpiration);
    }


    public boolean isTokenExpired(String token){
        return getExpirationDate(token).before(new Date());
    }

    public String getEmailFromToken(String token){
        return getClaims(token, claims -> claims.get("email", String.class));
    }
}
