package com.Ai2018.AuthorizationServer.controllers;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class LogoutController {
    @GetMapping("/exit")
    public void exit(HttpServletRequest request, HttpServletResponse response, @RequestParam(value = "returnTo") String referer) {
        new SecurityContextLogoutHandler().logout(request, null, null);
        try {
            response.sendRedirect(referer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
  }