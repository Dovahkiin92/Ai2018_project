package com.Ai2018.AuthorizationServer.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
@Order(2) //to be executed before resourceserver
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        // This should point to where users are stored (Which bean finds the users)
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }


  @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/oauth/authorize**", "/login**","/oauth/token**").permitAll()
                .and().authorizeRequests().antMatchers("/me**").hasAuthority("ADMIN")
                .and().authorizeRequests().antMatchers("/register").hasAuthority("ROLE_REGISTER")
                .and().authorizeRequests().antMatchers("/exit").hasAuthority("USER")
                .and().authorizeRequests().anyRequest().authenticated()
                .and().formLogin().permitAll().and().logout().logoutSuccessUrl("http://localhost4200");

        ;

    }
    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
