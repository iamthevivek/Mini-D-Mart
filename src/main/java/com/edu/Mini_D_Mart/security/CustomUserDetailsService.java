package com.edu.Mini_D_Mart.security;

import com.edu.Mini_D_Mart.user.entity.User;
import com.edu.Mini_D_Mart.user.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        String query = username.trim();
        User user = userRepository
                .findByEmailIgnoreCase(query)
                .or(() -> {
                    if (query.endsWith("@onemart.com")) {
                        return userRepository.findByEmailIgnoreCase(query.replace("@onemart.com", "@minidmart.com"));
                    } else if (query.endsWith("@minidmart.com")) {
                        return userRepository.findByEmailIgnoreCase(query.replace("@minidmart.com", "@onemart.com"));
                    }
                    return java.util.Optional.empty();
                })
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Invalid email or password"
                        )
                );

        return new CustomUserDetails(user);
    }
}