package com.Ai2018.ResourceServer.configuration;

import com.Ai2018.ResourceServer.services.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.PropertySource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;

@Configuration
@EnableResourceServer
@PropertySource(ignoreResourceNotFound = true, value = "application.properties")
public class OAuth2ResourceServerConfigJwt extends ResourceServerConfigurerAdapter {
    @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-secret}")
    private String SIGNING_KEY ;
    @Autowired
    private CustomAccessTokenConverter customAccessTokenConverter;
    @Override
    public void configure(final HttpSecurity http) throws Exception {
        // @formatter:off
                http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                        .and().authorizeRequests().antMatchers("/register").hasAuthority("ROLE_REGISTER")
                        .and().authorizeRequests().antMatchers("/account").hasAuthority("USER")
                        .and().authorizeRequests().antMatchers("/archives/**").hasAuthority("USER")
                        .and().authorizeRequests().antMatchers("/admin/**").hasAuthority("ROLE_ADMIN")
                        .and().authorizeRequests().antMatchers("/positions/**").hasRole("USER")
                    .and()
                    .authorizeRequests().anyRequest().authenticated();
        // @formatter:on
    }

    @Override
    public void configure(final ResourceServerSecurityConfigurer config) {
        config.tokenServices(tokenServices());
        config.resourceId("resourceId");
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        final JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setAccessTokenConverter(customAccessTokenConverter);

        converter.setSigningKey(SIGNING_KEY);
        return converter;
    }

    @Bean
    @Primary
    public DefaultTokenServices tokenServices() {
        final DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore());
        return defaultTokenServices;
    }

}
