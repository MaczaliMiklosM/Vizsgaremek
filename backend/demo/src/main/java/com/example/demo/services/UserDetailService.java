package com.example.demo.services;

import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Ez a szolgáltatás felelős a Spring Security által kért felhasználói adatok betöltéséért.
 * Az e-mail cím alapján próbálja meg lekérni a felhasználót.
 */
@Service
public class UserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    /**
     * Betölti a felhasználót az e-mail címe alapján.
     *
     * @param username az e-mail cím, amit a rendszer felhasználónévként kezel
     * @return a felhasználó biztonsági adatai (UserDetails)
     * @throws UsernameNotFoundException ha a felhasználó nem található
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
    }
}
