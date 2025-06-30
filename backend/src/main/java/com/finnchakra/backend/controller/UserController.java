
package com.finnchakra.backend.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

import com.finnchakra.backend.dto.AuthResponse;
import com.finnchakra.backend.dto.LoginRequest;
import com.finnchakra.backend.dto.UserDTO;
import com.finnchakra.backend.model.User;
import com.finnchakra.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "User Controller", description = "Handles registration and login")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public User register(@Valid @RequestBody UserDTO userDto) {
        User user = new User(userDto.getEmail(), userDto.getName(), userDto.getPassword());
        return userService.register(user);
    }

    @PostMapping("/login")
    @Operation(summary = "Login and receive JWT")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        String token = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }




}
