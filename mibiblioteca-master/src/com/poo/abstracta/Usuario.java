package src.com.poo.abstracta;

import src.com.poo.modelo.Libro;

public abstract class Usuario {
    protected String nombre;
    protected String id;

    public Usuario(String nombre, String id) {
        this.nombre = nombre;
        this.id = id;
    }

    public abstract void realizarPrestamo(Libro libro);

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    
}