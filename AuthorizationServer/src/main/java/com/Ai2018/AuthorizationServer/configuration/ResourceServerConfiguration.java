/*


package ai2018.AuthorizationServer.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.DefaultTokenServices;
import org.springframework.security.oauth2.provider.token.TokenStore;

@EnableResourceServer
@Configuration
@Order(9)
public class ResourceServerConfiguration extends ResourceServerConfigurerAdapter {
    @Value("${security.oauth2.resource.id}")
    String RESOURCE_ID;
    @Autowired
    private TokenStore tokenStore;

    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private AuthenticationManager authenticationManager;



    public DefaultTokenServices tokenServices(TokenStore tokenStore) {
        DefaultTokenServices defaultTokenServices = new DefaultTokenServices();
        defaultTokenServices.setTokenStore(tokenStore);
        defaultTokenServices.setSupportRefreshToken(true);
        return defaultTokenServices;
    }
    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
     resources.resourceId(RESOURCE_ID).tokenServices(tokenServices(tokenStore));
    }


   @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                //.antMatchers("/login**","oauth/authorize**","/oauth/token**").permitAll()
                //.and().authorizeRequests().anyRequest().authenticated()

                .antMatchers("/me**").hasAuthority("USER");
        //   .and().formLogin().permitAll()
                //
        // .and().csrf().disable()
        ;
    }

}


*/
