package src.com.poo.modelo;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

import src.com.poo.abstracta.Usuario;


public class Prestamo {
    private Libro libro;
    private Usuario usuario;
    private LocalDate fechaPrestamo;
    private LocalDate fechaDevolucion;
    private boolean devuelto;

    public Prestamo(Libro libro, Usuario usuario) {
        this.libro = libro;
        this.usuario = usuario;
        this.fechaPrestamo = LocalDate.now();
        this.devuelto = false;
    }

    public void registrarDevolucion() {
        this.fechaDevolucion = LocalDate.now();
        this.devuelto = true;
        libro.devolverEjemplar();
    }

    public double calcularMulta() {
        if (!devuelto || fechaDevolucion == null) return 0;

        long diasRetraso = ChronoUnit.DAYS.between(fechaPrestamo.plusDays(15), fechaDevolucion);
        return diasRetraso > 0 ? diasRetraso * 10 : 0;
    }

    public Libro getLibro() {
        return libro;
    }

    public void setLibro(Libro libro) {
        this.libro = libro;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public LocalDate getFechaPrestamo() {
        return fechaPrestamo;
    }

    public void setFechaPrestamo(LocalDate fechaPrestamo) {
        this.fechaPrestamo = fechaPrestamo;
    }

    public LocalDate getFechaDevolucion() {
        return fechaDevolucion;
    }

    public void setFechaDevolucion(LocalDate fechaDevolucion) {
        this.fechaDevolucion = fechaDevolucion;
    }

    public boolean isDevuelto() {
        return devuelto;
    }

    public void setDevuelto(boolean devuelto) {
        this.devuelto = devuelto;
    }

    // Getters

}