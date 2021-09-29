package com.Ai2018.ResourceServer.services;

import com.Ai2018.ResourceServer.models.Account;
import com.Ai2018.ResourceServer.models.requestModels.AccountRegistration;
import com.Ai2018.ResourceServer.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.security.auth.login.AccountException;
import java.util.List;

@Service
public class AccountService implements UserDetailsService {
    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public Account loadUserByUsername(String username) throws UsernameNotFoundException {
       Account account =accountRepository.findAccountByUsername(username);
       if(account==null) {
           throw new UsernameNotFoundException("User not found");
       }
       return account;
    }
    public Account register(AccountRegistration ar) throws Exception{
        Account existingAccount = accountRepository.findAccountByUsername(ar.getUsername());
        if (existingAccount == null) {
            Account account = new Account();
            account.setUsername(ar.getUsername());
            account.setPassword(passwordEncoder.encode(ar.getPassword()));
            account.setWallet(10.0);
            account.grantAuthority("ROLE_USER");
            return accountRepository.save(account);
        } else {
            throw new Exception("Username already taken");
        }
    }
    @Transactional
    public Account update(Account account) throws Exception {
        Account existingAccount = accountRepository.findAccountByUsername(account.getUsername());
        if (existingAccount != null) {
            accountRepository.deleteAccountByUsername(existingAccount.getUsername());
            return accountRepository.save(account);
        } else {
            throw new Exception("Account does not exist");
        }
    }

    public List<Account> findAll() {
        return accountRepository.findAll();
    }

    public Account findAccountByUsername(String username) throws Exception{
        Account account = accountRepository.findAccountByUsername(username);
        if (account != null) {
            return account;
        } else {
            throw new Exception("Account not found.");
        }
    }

    public void grantRole(Account account, String role) throws Exception{
        if(!role.equalsIgnoreCase("admin") &&
                !role.equalsIgnoreCase("user") &&
                !role.equalsIgnoreCase("admin")){
            throw new Exception("Invalid role");
        }
        account.grantAuthority("ROLE_"+role.toUpperCase()) ;
    }
    public void revokeRole(Account account, String role) throws Exception{
        if(!role.equalsIgnoreCase("admin") &&
                !role.equalsIgnoreCase("user") &&
                !role.equalsIgnoreCase("admin")){
            throw new Exception("Invalid role");
        }
        account.revokeAuthority("ROLE_"+role.toUpperCase()) ;
    }
}
