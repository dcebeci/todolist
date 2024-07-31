package com.dcebeci.todolist.controllers;

import com.dcebeci.todolist.models.TodoModel;
import com.dcebeci.todolist.services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    @Autowired
    private TodoService todoService;
    @GetMapping
    public List<TodoModel> getAllTodos() {
        return todoService.findAll();
    }
    @GetMapping("/{id}")
    public Optional<TodoModel> getTodoById(@PathVariable Long id) {
        return todoService.findById(id);
    }
    @PostMapping
    public TodoModel createTodoModel(@RequestBody TodoModel todoModel) {
        return todoService.save(todoModel);
    }

    @PutMapping("/{id}")
    public TodoModel updateTodoModel(@PathVariable Long id, @RequestBody TodoModel todoModel) {
        todoModel.setId(id);
        return todoService.save(todoModel);
    }
    @DeleteMapping("/{id}")
    public void deleteTodoModel(@PathVariable Long id) {
        todoService.deleteById(id);
    }









}
