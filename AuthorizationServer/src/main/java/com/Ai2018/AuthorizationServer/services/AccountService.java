package com.Ai2018.AuthorizationServer.services;


import com.Ai2018.AuthorizationServer.models.Account;
import com.Ai2018.AuthorizationServer.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public Account loadUserByUsername(String username) throws UsernameNotFoundException {
    /*
            return new
                    User("user",
                            passwordEncoder.encode("password")
                            ,new ArrayList<>();*/
       Account account =accountRepository.findAccountByUsername(username);

       if(account==null) {
           throw new UsernameNotFoundException("User not found");
       }
       account.grantAuthority("USER");

        return account;
    }
}
