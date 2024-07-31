package com.dcebeci.todolist.repository;

import com.dcebeci.todolist.models.TodoModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<TodoModel, Long> {


}
