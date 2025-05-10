package com.example.friendfinder.config.jwt;

import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.jwt.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.SystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AuthFilter extends OncePerRequestFilter {

    @Autowired
    private UserService userService;
    @Autowired
    private TokenHandler tokenHandler;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // get  the url from the request
        String path = request.getRequestURI();
        if (path.contains("login") || path.contains("create-user")) {
            return true;
        }

        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String token = request.getHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            response.reset();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        token = token.substring(7);
        if (!tokenHandler.validateToken(token)) {
            response.reset();
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        try {
            Users users = userService.checkUserExistByToken(token);
            if (users == null) {
                response.reset();
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }


            //  here  we need to tell the second filter which is spring  security filter that   the user signrd in

            List<GrantedAuthority> grantedAuthorities = users.getRoles().stream().map(role -> new SimpleGrantedAuthority(role.getCode())).collect(Collectors.toList());

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                    new UsernamePasswordAuthenticationToken(users, null, grantedAuthorities);


            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            filterChain.doFilter(request, response);

        } catch (SystemException e) {
            throw new RuntimeException(e);
        }
    }
}

