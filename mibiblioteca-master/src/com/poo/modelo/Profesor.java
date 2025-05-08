package src.com.poo.modelo;

import src.com.poo.abstracta.Usuario;

public class Profesor extends Usuario {
    private String departamento;

    public Profesor(String nombre, String id, String departamento) {
        super(nombre, id);
        this.departamento = departamento;
    }

    @Override
    public void realizarPrestamo(Libro libro) {
        if (libro.prestarEjemplar()) {
            System.out.println("Préstamo exitoso para el profesor: " + nombre);
        } else {
            System.out.println("No hay ejemplares disponibles");
        }
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    
}

