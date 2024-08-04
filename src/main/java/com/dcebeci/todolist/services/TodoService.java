package com.dcebeci.todolist.services;

import com.dcebeci.todolist.models.TodoModel;
import com.dcebeci.todolist.repositories.TodoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    @Autowired
    private TodoRepository todoRepository;

    public List<TodoModel> findAll() {

        return todoRepository.findAll();
    }

    public Optional<TodoModel> findById(Long id) {

        return todoRepository.findById(id);
    }

    public TodoModel save(TodoModel todoModel) {

        return todoRepository.save(todoModel);
    }

    public void deleteById(Long id) {

        todoRepository.deleteById(id);
    }
    @Transactional
    public void deleteAllCompletedTodos() {
        todoRepository.deleteByCboxStatusTrue();
    }
}
