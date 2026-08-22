package com.edu.Mini_D_Mart.config;

import com.edu.Mini_D_Mart.security.CustomUserDetailsService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;

import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

import org.springframework.security.authentication.ProviderManager;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.util.Base64;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    private final String jwtSecret;

    private final String jwtIssuer;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.issuer}") String jwtIssuer
    ) {
        this.userDetailsService = userDetailsService;
        this.jwtSecret = jwtSecret;
        this.jwtIssuer = jwtIssuer;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
            PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationProvider authenticationProvider
    ) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public SecretKey jwtSecretKey() {

        byte[] decodedSecret;

        try {
            decodedSecret =
                    Base64.getDecoder().decode(jwtSecret);

        } catch (IllegalArgumentException exception) {

            throw new IllegalStateException(
                    "JWT_SECRET must be valid Base64",
                    exception
            );
        }

        if (decodedSecret.length < 32) {

            throw new IllegalStateException(
                    "JWT_SECRET must decode to at least 32 bytes"
            );
        }

        return new SecretKeySpec(
                decodedSecret,
                "HmacSHA256"
        );
    }

    @Bean
    public JwtEncoder jwtEncoder(
            SecretKey jwtSecretKey
    ) {
        return NimbusJwtEncoder
                .withSecretKey(jwtSecretKey)
                .algorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey jwtSecretKey
    ) {

        NimbusJwtDecoder decoder =
                NimbusJwtDecoder
                        .withSecretKey(jwtSecretKey)
                        .macAlgorithm(MacAlgorithm.HS256)
                        .build();

        decoder.setJwtValidator(
                JwtValidators.createDefaultWithIssuer(jwtIssuer)
        );

        return decoder;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("role");

        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(
                authoritiesConverter
        );

        return converter;
    }

    @Bean
    public org.springframework.security.web.SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .cors(withDefaults())
                .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/",
                                "/api/health",
                                "/api/auth/register",
                                "/api/auth/login",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/h2-console/**",
                                "/error"
                        )
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories",
                                "/api/categories/**",
                                "/api/products",
                                "/api/products/**",
                                "/api/slots",
                                "/api/slots/**"
                        )
                        .permitAll()

                        .requestMatchers(
                                "/api/cart/**",
                                "/api/orders/customer/**",
                                "/api/returns/customer/**"
                        )
                        .hasRole("CUSTOMER")

                        .requestMatchers(
                                "/api/operations/**",
                                "/api/orders/staff/**",
                                "/api/returns/staff/**"
                        )
                        .hasAnyRole("STAFF", "MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/analytics/**",
                                "/api/inventory/**"
                        )
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/categories/**",
                                "/api/products/**",
                                "/api/slots/**"
                        )
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/categories/**",
                                "/api/products/**",
                                "/api/slots/**"
                        )
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/categories/**",
                                "/api/products/**",
                                "/api/slots/**"
                        )
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/categories/**",
                                "/api/products/**",
                                "/api/slots/**"
                        )
                        .hasAnyRole("MANAGER", "ADMIN")

                        .requestMatchers(
                                "/api/admin/**",
                                "/api/users/**"
                        )
                        .hasRole("ADMIN")

                        .anyRequest()
                        .authenticated()
                )
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(jwt ->
                                jwt.jwtAuthenticationConverter(
                                        jwtAuthenticationConverter
                                 )
                        )
                );

        return http.build();
    }
}