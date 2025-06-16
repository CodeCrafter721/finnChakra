
package com.finnchakra.backend.controller;

import com.finnchakra.backend.dto.UserDTO;
import com.finnchakra.backend.model.User;
import com.finnchakra.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public User register(@RequestBody UserDTO userDto) {
        User user = new User(userDto.getEmail(), userDto.getName(), userDto.getPassword());
        return userService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody UserDTO userDto) {
        return userService.login(userDto.getEmail(), userDto.getPassword());
    }
}
