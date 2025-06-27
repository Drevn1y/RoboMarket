package com.msi.robomarket.Robo.controller;

import com.msi.robomarket.Robo.dto.auth.LoginRequestDTO;
import com.msi.robomarket.Robo.dto.auth.LoginResponseDTO;
import com.msi.robomarket.Robo.dto.user.CreateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UpdateUserRequestDTO;
import com.msi.robomarket.Robo.dto.user.UserResponseDTO;
import com.msi.robomarket.Robo.enums.Role;
import com.msi.robomarket.Robo.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;

@Data
@RestController
@RequestMapping("api/v1/users")
@Tag(name = "Пользователи", description = "Работа с пользователем")
public class UserController {

    private final UserService userService;

    @GetMapping("/all")
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/user/id/{id}")
    public Optional<UserResponseDTO> getById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @GetMapping("/user/phone/{phone}")
    public Optional<UserResponseDTO> getByPhone(@PathVariable String phone) {
        return userService.findUserByPhone(phone);
    }

    @GetMapping("/user/mail/{mail}")
    public Optional<UserResponseDTO> getByMail(@PathVariable String mail) {
        return userService.findUserByEmail(mail);
    }

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody CreateUserRequestDTO dto) {
        return userService.createUser(dto);
    }

    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO dto) {
        return userService.login(dto);
    }

    @PutMapping("/edit/{id}")
    public UserResponseDTO update(@PathVariable Long id, @RequestBody UpdateUserRequestDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @PutMapping("/user/{id}/block")
    public ResponseEntity<String> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.ok("User blocked");
    }

    @PutMapping("/user/{id}/unblock")
    public ResponseEntity<String> unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
        return ResponseEntity.ok("User unblocked");
    }

    @PutMapping("/user/{id}/role")
    public ResponseEntity<String> changeRole(@PathVariable Long id, @RequestParam Role role) {
        userService.changeUserRole(id, role);
        return ResponseEntity.ok("User role updated to " + role);
    }

    @GetMapping("/all-admin")
    public List<UserResponseDTO> getAllAdmin() {
        return userService.findAllAdmin();
    }

    @PostMapping(
            path = "/{id}/upload-photo",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadProfilePhoto(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        userService.uploadPhoto(id, file);
        return ResponseEntity.ok("Photo uploaded successfully");
    }

    @GetMapping("/{id}/photo")
    public ResponseEntity<Resource> getUserPhoto(@PathVariable Long id) {
        Resource photo = userService.getUserPhoto(id);

        try {
            String contentType = Files.probeContentType(photo.getFile().toPath());
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(photo);

        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }


}
