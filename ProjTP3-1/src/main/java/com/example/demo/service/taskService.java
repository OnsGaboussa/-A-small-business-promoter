package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.demo.model.task;
import com.example.demo.repository.TaskRepository;

@Service
public class taskService {

    private final TaskRepository repo;

    public taskService(TaskRepository repo) {
        this.repo = repo;
    }

    public List<task> getAll() {
        return repo.findAll();
    }

    public task save(task task) {
        return repo.save(task);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public task toggleComplete(Long id) {
        Optional<task> optionalTask = repo.findById(id);
        if (optionalTask.isPresent()) {
            task t = optionalTask.get();
            t.setCompleted(!t.isCompleted()); // assumes you have get/set methods
            return repo.save(t);
        } else {
            throw new RuntimeException("Task not found with id " + id);
        }
    }

	public task findById(Long id) {
		// TODO Auto-generated method stub
		return repo.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
	}
}
