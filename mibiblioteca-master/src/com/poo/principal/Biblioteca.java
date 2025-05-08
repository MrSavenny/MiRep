package src.com.poo.principal;

import java.util.ArrayList;
import java.util.List;

import src.com.poo.abstracta.Usuario;
import src.com.poo.modelo.Libro;
import src.com.poo.modelo.Prestamo;

public class Biblioteca {
    private List<Libro> inventario = new ArrayList<>();
    private List<Usuario> usuarios = new ArrayList<>();
    private List<Prestamo> prestamosActivos = new ArrayList<>();
    private List<Prestamo> historialPrestamos = new ArrayList<>();

    public void registrarLibro(Libro libro) {
        inventario.add(libro);
    }

    public void registrarUsuario(Usuario usuario) {
        usuarios.add(usuario);
    }

    public Libro buscarLibro(String ISBN) {
        return inventario.stream()
                .filter(libro -> libro.getISBN().equals(ISBN))
                .findFirst()
                .orElse(null);
    }

    public Usuario buscarUsuario(String id) {
        return usuarios.stream()
                .filter(usuario -> usuario.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public boolean realizarPrestamo(String ISBN, String idUsuario) {
        Libro libro = buscarLibro(ISBN);
        Usuario usuario = buscarUsuario(idUsuario);
        
        if (libro == null || usuario == null) return false;
        
        if (libro.prestarEjemplar()) {
            Prestamo prestamo = new Prestamo(libro, usuario);
            prestamosActivos.add(prestamo);
            return true;
        }
        return false;
    }

    public boolean registrarDevolucion(String ISBN) {
        Prestamo prestamo = prestamosActivos.stream()
                .filter(p -> p.getLibro().getISBN().equals(ISBN) && !p.isDevuelto())
                .findFirst()
                .orElse(null);
        
        if (prestamo != null) {
            prestamo.registrarDevolucion();
            prestamosActivos.remove(prestamo);
            historialPrestamos.add(prestamo);
            return true;
        }
        return false;
    }

    public void generarReporte() {
        System.out.println("\n=== REPORTE BIBLIOTECA ===");
        System.out.println("Libros disponibles: " + inventario.size());
        System.out.println("Préstamos activos: " + prestamosActivos.size());
        System.out.println("Historial total: " + historialPrestamos.size());
    }
}