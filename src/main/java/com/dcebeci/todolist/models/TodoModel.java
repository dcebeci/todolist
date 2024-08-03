package com.dcebeci.todolist.models;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "todo_variables")
public class TodoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String todoText;
    private boolean cboxStatus;
}
