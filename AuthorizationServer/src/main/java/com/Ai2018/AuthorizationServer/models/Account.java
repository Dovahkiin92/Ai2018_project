package com.Ai2018.AuthorizationServer.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Document(collection = "accounts")
public class Account implements UserDetails {
    @Id
    private String id;
    private String username;
    private String password;
    private boolean accountNonExpired, accountNonLocked, credentialsNonExpired, enabled;
    List<GrantedAuthority> authorities;

    public Account() {
        this.accountNonExpired = true;
        this.credentialsNonExpired = true;
        this.accountNonLocked = true;
        this.enabled = true;
        this.authorities= new ArrayList<>();

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    public Collection<? extends GrantedAuthority> grantAuthority(String authority) {
        this.authorities.add(new SimpleGrantedAuthority(authority));
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }
    public void setPassword(String password){this.password=password;}
    public void setUsername(String username){this.username=username;}
    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public void setId(long i) { this.id=id;    }
}
