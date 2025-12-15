package com.example.audio.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String sayHello() {
        return "Welcome to the Audio Transcription Service!";
    }
}   