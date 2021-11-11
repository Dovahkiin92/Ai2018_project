package com.Ai2018.ResourceServer;

import com.Ai2018.ResourceServer.models.requestModels.AccountRegistration;
import com.Ai2018.ResourceServer.repositories.AccountRepository;
import com.Ai2018.ResourceServer.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class InitRunner implements CommandLineRunner {

    @Autowired
    AccountService accountService;
    @Override
    public void run(String... args) throws Exception {
        if(!accountService.existsAccountByRole("ADMIN")){
            // insert default admin
            AccountRegistration ar = new AccountRegistration();
            ar.setUsername("admin");
            ar.setPassword("password");
            accountService.registerAdmin(ar);
        }

    }
}
