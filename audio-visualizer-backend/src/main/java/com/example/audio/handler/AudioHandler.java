package com.example.audio.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class AudioHandler implements WebSocketHandler {

    private static final Logger log =
            LoggerFactory.getLogger(AudioHandler.class);

    private static final String[] MOCK_WORDS = {
            "Hello", "this", "is", "a", "real",
            "time", "streaming", "transcription",
            "demo"
    };

    private final AtomicInteger wordIndex = new AtomicInteger(0);

    @Override
    public Mono<Void> handle(WebSocketSession session) {

        log.info("🟢 WebSocket handler started");

        Flux<String> transcriptStream =
                session.receive()
                        .doOnSubscribe(sub ->
                                log.info("✅ WebSocket client connected")
                        )
                        .doOnNext(msg -> {
                            DataBuffer buffer = msg.getPayload();
                            log.info(
                                "🎧 Audio chunk received | size = {} bytes",
                                buffer.readableByteCount()
                            );
                        })
                        .map(msg -> getNextWord())
                        .doOnNext(word ->
                                log.info("📤 Sending to frontend → '{}'", word)
                        )
                        .delayElements(Duration.ofMillis(200)); // streaming feel

        return session.send(
                transcriptStream.map(session::textMessage)
        );
    }

    private String getNextWord() {
        int index = wordIndex.getAndIncrement();
        if (index >= MOCK_WORDS.length) {
            return "";
        }
        return MOCK_WORDS[index] + " ";
    }
}
