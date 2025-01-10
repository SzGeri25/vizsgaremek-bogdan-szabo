/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.idopontfoglalo.gbmedicalbackend.config;

import com.idopontfoglalo.gbmedicalbackend.model.Doctors;
import com.idopontfoglalo.gbmedicalbackend.model.Patients;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.impl.TextCodec;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;

/**
 *
 * @author szabo
 */
public class JWT {

    private static final String SIGN = "09ce78e64c7d6667e04798aa897e2bbc194d0ce5d19aef677b4477ba0932d972";
    private static final byte[] SECRET = Base64.getDecoder().decode(SIGN);

    public static String createJWT(Patients p) {
        Instant now = Instant.now();

        String token = Jwts.builder()
                .setIssuer("GBmedical")
                .setSubject("test")
                .claim("id", p.getId())
                .claim("isAdmin", p.getIsAdmin())
                .claim("createdAt", p.getCreatedAt())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(1, ChronoUnit.DAYS)))
                .signWith(
                        SignatureAlgorithm.HS256,
                        TextCodec.BASE64.decode(SIGN)
                )
                .compact();

        return token;
    }

    public static String createJWT(Doctors p) {
        Instant now = Instant.now();

        String token = Jwts.builder()
                .setIssuer("GBmedical")
                .setSubject("test")
                .claim("id", p.getId())
                .claim("isAdmin", p.getIsAdmin())
                .claim("createdAt", p.getCreatedAt())
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plus(1, ChronoUnit.DAYS)))
                .signWith(
                        SignatureAlgorithm.HS256,
                        TextCodec.BASE64.decode(SIGN)
                )
                .compact();

        return token;
    }

    public static int validateJWT(String jwt) {
        try {
            Jws<Claims> result;
            result = Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(SECRET)).parseClaimsJws(jwt);
            int id = result.getBody().get("id", Integer.class);
            Patients p = new Patients(id);

            if (p.getId() == id) {
                return 1;
            } else {
                return 2; //Ez akkor történik amikor egy érvénytelen tokent akarunk validáltatni
            }
        } catch (ExpiredJwtException | MalformedJwtException | UnsupportedJwtException | SignatureException | WeakKeyException | IllegalArgumentException e) {
            System.err.println("JWT validation error: " + e.getLocalizedMessage());
            return 3; //Akkor történik ha lejárt a JWT-k
        }

    }

    public static Boolean isAdmin(String jwt) {
        Jws<Claims> result;
        result = Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(SECRET)).parseClaimsJws(jwt);

        Boolean isAdmin = result.getBody().get("isAdmin", Boolean.class);

        return isAdmin;
    }
}
