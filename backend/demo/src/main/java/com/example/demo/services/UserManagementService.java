package com.example.demo.services;

import com.example.demo.dto.auth.LoginRequest;
import com.example.demo.dto.auth.RegisterRequest;
import com.example.demo.dto.ReqRes;
import com.example.demo.dto.user.UserUpdateRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Új felhasználó regisztrálása.
     * @param registrationRequest a felhasználó adatai
     * @return válasz, ami tartalmazza a mentett felhasználót vagy hibaüzenetet
     */
    public ReqRes register(RegisterRequest registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            if (emailExists(registrationRequest.getEmail())) {
                resp.setStatusCode(400);
                resp.setMessage("Email already exists");
                return resp;
            }

            User user = new User();
            user.setEmail(registrationRequest.getEmail());
            user.setCountry(registrationRequest.getCountry());
            user.setRole("USER");
            user.setFull_name(registrationRequest.getName());
            user.setAddress(registrationRequest.getAddress());
            user.setPhone_number(registrationRequest.getPhoneNumber());
            user.setPassword_hash(passwordEncoder.encode(registrationRequest.getPassword()));
            User userResult = userRepository.save(user);

            if (userResult.getId() > 0) {
                resp.setUser(userResult);
                resp.setMessage("User Saved Successfully");
                resp.setStatusCode(200);
                notificationService.sendNotification(userResult, "Successful registration!");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError(e.getMessage());
        }

        return resp;
    }

    /**
     * Felhasználó bejelentkezése e-mail és jelszó alapján.
     * @param loginRequest a belépési adatok
     * @return JWT tokennel visszatérő válasz
     */
    public ReqRes login(LoginRequest loginRequest) {
        ReqRes response = new ReqRes();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
            var user = userRepository.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully logged in");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    /**
     * Frissíti a meglévő JWT tokent, ha az még érvényes.
     * @param refreshTokenRequest a meglévő token
     * @return új token vagy hiba
     */
    public ReqRes refreshToken(ReqRes refreshTokenRequest) {
        ReqRes response = new ReqRes();
        try {
            String email = jwtUtils.extractUsername(refreshTokenRequest.getToken());
            User users = userRepository.findByEmail(email).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }

    /**
     * Lekérdezi az összes felhasználót.
     * @return felhasználók listája vagy hiba
     */
    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<User> result = userRepository.findAll();
            if (!result.isEmpty()) {
                reqRes.setUserList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }

    /**
     * Felhasználó lekérése azonosító alapján.
     * @param id a felhasználó azonosítója
     * @return a megtalált felhasználó vagy hiba
     */
    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            User usersById = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setUser(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Felhasználó törlése azonosító alapján.
     * @param userId a felhasználó azonosítója
     * @return siker vagy hibaüzenet
     */
    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                userRepository.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Felhasználó adatainak frissítése.
     * @param userId a felhasználó azonosítója
     * @param updateRequest az új adatok
     * @return frissített felhasználó vagy hiba
     */
    public ReqRes updateUser(Integer userId, UserUpdateRequest updateRequest) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isPresent()) {
                User existingUser = userOptional.get();

                existingUser.setFull_name(updateRequest.getFull_name());
                existingUser.setEmail(updateRequest.getEmail());
                existingUser.setPhone_number(updateRequest.getPhone_number());
                existingUser.setCountry(updateRequest.getCountry());
                existingUser.setAddress(updateRequest.getAddress());

                User savedUser = userRepository.save(existingUser);
                reqRes.setUser(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Lekéri a bejelentkezett felhasználó profilját.
     * @param username az e-mail cím
     * @return profil információ vagy hiba
     */
    public ReqRes getMyInfo(String username) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<User> userOptional = userRepository.findByEmail(username);
            if (userOptional.isPresent()) {
                reqRes.setUser(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Megnézi, hogy létezik-e a megadott e-mail.
     * @param email a vizsgálandó e-mail cím
     * @return igaz, ha az e-mail már szerepel az adatbázisban
     */
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
}
