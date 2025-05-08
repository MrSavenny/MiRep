package src.com.poo.modelo;

import src.com.poo.abstracta.Usuario;

public class Estudiante extends Usuario {
    private String carrera;

    public Estudiante(String nombre, String id, String carrera) {
        super(nombre, id);
        this.carrera = carrera;
    }

    
    @Override
    public void realizarPrestamo(Libro libro) {
        if (libro.prestarEjemplar()) {
            System.out.println("Préstamo exitoso para el estudiante: " + nombre);
        } else {
            System.out.println("No hay ejemplares disponibles");
        }
    }


    public String getCarrera() {
        return carrera;
    }


    public void setCarrera(String carrera) {
        this.carrera = carrera;
    }
}