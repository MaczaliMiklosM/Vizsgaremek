package com.example.demo.config;


import com.example.demo.enums.UserRole;
import com.example.demo.services.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private static final String[] WHITE_LIST_URL = { "/api/v1/auth/**", "/v2/api-docs", "/v3/api-docs",
            "/v3/api-docs/**", "/swagger-resources", "/swagger-resources/**", "/configuration/ui",
            "/configuration/security", "/swagger-ui/**", "/webjars/**", "/swagger-ui.html", "/api/auth/**",
            "/api/test/**", "/admin", "/management/**", "/products/getProducts", "/products/getProductById/{id}", "/products/createProduct", "/api/wishlist/**"};


    @Autowired
    private UserDetailService ourUserDetailService;
    @Autowired
    private JWTAuthFilter jwtAuthFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                        "/api/v1/auth/**", "/api/auth/**", "/api/public/**",
                                        "/v2/api-docs", "/v3/api-docs/**", "/swagger-resources/**",
                                        "/swagger-ui/**", "/webjars/**", "/swagger-ui.html",
                                        "/products/getProducts", "/products/getProductById/**",
                                        "/management/check-email", "/management/check-email/**" // 👈 EZ KELL!
                                ).permitAll()


                        .requestMatchers("/notifications/**").authenticated()
                        .requestMatchers("/orders/**").hasAnyAuthority("USER", "ADMIN") // ⬅️ ADD THIS
                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .requestMatchers("/wishlist/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/management/admin/update/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/products/getProductById/**").permitAll()
                        .requestMatchers("/bids/place").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/bids/accept/").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/bids/reject/").hasAnyAuthority("USER", "ADMIN")

                        .requestMatchers("/bids/user/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/bids/received/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/products/by-user/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/products/create").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/management/check-email/**").permitAll()
                        .requestMatchers("/notifications/my").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/notifications/mark-read").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/collection/**").authenticated()



                        .requestMatchers("/bids/product/**").hasAnyAuthority("USER", "ADMIN")
                        .requestMatchers("/admin/**", "/products/deleteProduct/**", "/products/approveProduct/**").hasAuthority("ADMIN")
                        .requestMatchers("/adminuser/**").hasAnyAuthority("USER", "ADMIN")
                        .anyRequest().authenticated()

                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(ourUserDetailService);
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }

}