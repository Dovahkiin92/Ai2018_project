package com.Ai2018.ResourceServer.repositories;

import com.Ai2018.ResourceServer.models.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccountRepository extends MongoRepository<Account,String> {
    Account findAccountByUsername(String username);
    List<Account> findAll();
    List<Account> findAllByAuthoritiesContains(GrantedAuthority authority);
    Account findAccountById(String id);
    Account save(Account account);
    Account deleteAccountByUsername(String username);
}


