package com.example.demo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping; // Needed if you handle update/toggle
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.task;
import com.example.demo.service.taskService;

@RestController
@RequestMapping("/api/tasks")
public class taskController {

    private final taskService service;

    public taskController(taskService service) {
        this.service = service;
    }

    @GetMapping
    public List<task> getAll() {
        return service.getAll();
    }

    @PostMapping
    public task create(@RequestBody task task) {
        return service.save(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @PutMapping("/{id}/toggle")
    public task toggleCompletion(@PathVariable Long id) {
        return service.toggleComplete(id); // You must implement this method in the service
    }
    @PutMapping("/{id}")
    public task updateTask(@PathVariable Long id, @RequestBody task updatedTask) {
        task existingTask = service.findById(id);
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setCompleted(updatedTask.isCompleted());
        return service.save(existingTask);
    }

}
