package com.example.audio.service;

import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import org.springframework.core.io.buffer.DataBuffer;

@Service
public class GeminiService {

    public Flux<String> stream(DataBuffer buffer) {
        return Flux.just("Listening...", "Processing...", "Transcribing...");
    }
}

