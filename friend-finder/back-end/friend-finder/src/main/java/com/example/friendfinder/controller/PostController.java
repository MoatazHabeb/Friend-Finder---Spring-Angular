package com.example.friendfinder.controller;

import com.example.friendfinder.controller.vm.SearchResponse;
import com.example.friendfinder.model.Post;
import com.example.friendfinder.model.clientmodel.Users;
import com.example.friendfinder.service.PostService;

import com.example.friendfinder.service.dto.PostDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;

@RestController
public class PostController {
    @Autowired
    private PostService postService;


    @PostMapping("/uploadPost")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<?> uploadVideo(@RequestParam("file") MultipartFile file, @RequestParam("text") String text) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users user = (Users) authentication.getPrincipal();

        // Get current working directory
        String currentDir = new File("").getAbsolutePath();

        // Append "friend-finder" to path if it's not already there
        if (!currentDir.endsWith("friend-finder")) {
            currentDir = currentDir + File.separator + "friend-finder";
        }

        String uploadDir = currentDir + File.separator + "upload" + File.separator;

        System.out.println("Saving file to directory: " + uploadDir);

        // Create filename with timestamp to avoid duplicates
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

        // Ensure directory exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean created = directory.mkdirs();
            System.out.println("Directory created: " + created);
        }

        // Save file
        File savedFile = new File(uploadDir + fileName);
        Files.write(savedFile.toPath(), file.getBytes());

        System.out.println("File saved at: " + savedFile.getAbsolutePath());

        // Create Post and set fields
        Post post = new Post();
        post.setUser(user);
        post.setText(text);

        // Check content type
        String contentType = file.getContentType();
        if (contentType != null && contentType.startsWith("video")) {
            post.setVideo("/upload/" + fileName);
        } else if (contentType != null && contentType.startsWith("image")) {
            post.setImage("/upload/" + fileName);
        } else {
            return ResponseEntity.badRequest().body("Unsupported file type: " + contentType);
        }

        postService.savePost(post);

        return ResponseEntity.ok(Map.of(
                "fileUrl", "/upload/" + fileName,
                "absolutePath", savedFile.getAbsolutePath(),
                "type", contentType
        ));
    }

    @GetMapping("/getAllPostes")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<PostDto>> getAllPostes(){

        return ResponseEntity.ok( postService.getAllPosts());
    }

    @GetMapping("/getMyAllPostes")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<PostDto>> getMyAllPostes(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Users userss = (Users) authentication.getPrincipal();
        return ResponseEntity.ok( postService.getMyAllPosts(userss));
    }

    @GetMapping("/getPostesById/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<PostDto>> getPostesById(@PathVariable Long id){
        return ResponseEntity.ok( postService.getPostesById(id));
    }

    @GetMapping("/search/{letters}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    ResponseEntity<SearchResponse> search(@PathVariable("letters") String letter){
        return ResponseEntity.ok(postService.getPostOrUserByLetters(letter));
    }
}
