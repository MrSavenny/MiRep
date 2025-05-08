package src.com.poo.principal;

import java.util.Scanner;

import src.com.poo.modelo.Estudiante;
import src.com.poo.modelo.Libro;
import src.com.poo.modelo.Profesor;

public class ControlBiblioteca {
    public static void main(String[] args) {
        Biblioteca biblioteca = new Biblioteca();
        Scanner scanner = new Scanner(System.in);
        
        // Datos iniciales de prueba
        biblioteca.registrarLibro(new Libro("Cien años de soledad", "García Márquez", "978-1234", 3));
        biblioteca.registrarLibro(new Libro("El principito", "Saint-Exupéry", "978-5678", 2));
        biblioteca.registrarUsuario(new Estudiante("Ana López", "A123", "Sistemas"));
        biblioteca.registrarUsuario(new Profesor("Dr. Pérez", "P456", "Matemáticas"));

        while (true) {
            System.out.println("\n=== MENÚ BIBLIOTECA ===");
            System.out.println("1. Registrar préstamo");
            System.out.println("2. Registrar devolución");
            System.out.println("3. Mostrar reporte");
            System.out.println("4. Salir");
            System.out.print("Seleccione una opción: ");
            
            int opcion = scanner.nextInt();
            scanner.nextLine(); // Limpiar buffer
            
            switch (opcion) {
                case 1:
                    System.out.print("Ingrese ISBN del libro: ");
                    String isbnPrestamo = scanner.nextLine();
                    System.out.print("Ingrese ID de usuario: ");
                    String idUsuario = scanner.nextLine();
                    
                    if (biblioteca.realizarPrestamo(isbnPrestamo, idUsuario)) {
                        System.out.println("Préstamo registrado con éxito");
                    } else {
                        System.out.println("Error: Libro no disponible o usuario no registrado");
                    }
                    break;
                    
                case 2:
                    System.out.print("Ingrese ISBN del libro a devolver: ");
                    String isbnDevolucion = scanner.nextLine();
                    
                    if (biblioteca.registrarDevolucion(isbnDevolucion)) {
                        System.out.println("Devolución registrada con éxito");
                    } else {
                        System.out.println("Error: No se encontró préstamo activo con ese ISBN");
                    }
                    break;
                    
                case 3:
                    biblioteca.generarReporte();
                    break;
                    
                case 4:
                    System.out.println("Saliendo del sistema...");
                    scanner.close();
                    System.exit(0);
                    
                default:
                    System.out.println("Opción no válida");
            }
        }
    }
}