package com.example.paintings_app_backend.controller;

import com.example.paintings_app_backend.domain.Painting;
import com.example.paintings_app_backend.service.PaintingService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/paintings")
public class PaintingController {
    final PaintingService service;

    @Autowired
    public PaintingController(PaintingService service) {
        this.service = service;
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        testSleep();
        return ResponseEntity.ok("Hello from PaintingController (secured endpoint)!");
    }

    @GetMapping("")
    public ResponseEntity<List<Painting>> getAll(@RequestParam(name = "sort", required = false, defaultValue = "asc") String sort) {
        testSleep();
        boolean desc = "desc".equalsIgnoreCase(sort);
        var result = service.getAll(desc);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Painting> getById(@PathVariable int id) {
        testSleep();
        var result = service.getById(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<Painting> add(@RequestBody Painting painting) {
        testSleep();
        var result = service.add(painting);
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Painting> update(@PathVariable int id, @RequestBody Painting painting) {
        testSleep();
        var result = service.update(id, painting);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        testSleep();
        service.delete(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    void testSleep() {
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
