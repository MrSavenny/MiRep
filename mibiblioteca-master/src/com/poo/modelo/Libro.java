package src.com.poo.modelo;
public class Libro{
/**
* Clase que representa un libro con sus características básicas.
* Permite almacenar información sobre título, autor y páginas.
*
* @author Juan Daniel Garcia Roman
* @version 1.0
*/
    private String titulo;
    private String autor;
    private String ISBN;
    private int ejemplaresDisponibles;

/**
* Constructor completo para crear un libro con todos sus atributos.
*
* @param titulo El título del libro (no puede ser vacío)
* @param autor El autor del libro (no puede ser vacío)
* @param isbn Código ISBN del libro (formato válido)
* @param ejemplares Número de ejemplares del libro (debe ser mayor que 0)
*/

// Constructor
public Libro(String titulo, String autor, String ISBN, int ejemplares) {
    this.titulo = titulo;
    this.autor = autor;
    this.ISBN = ISBN;
    this.ejemplaresDisponibles = ejemplares;
}

// Métodos
public boolean prestarEjemplar() {
    if (ejemplaresDisponibles > 0) {
        ejemplaresDisponibles--;
        return true;
    }
    return false;
}

public void devolverEjemplar() {
    ejemplaresDisponibles++;
}

public String getTitulo() {
    return titulo;
}

public void setTitulo(String titulo) {
    this.titulo = titulo;
}

public String getAutor() {
    return autor;
}

public void setAutor(String autor) {
    this.autor = autor;
}

public String getISBN() {
    return ISBN;
}

public void setISBN(String iSBN) {
    ISBN = iSBN;
}

public int getEjemplaresDisponibles() {
    return ejemplaresDisponibles;
}

public void setEjemplaresDisponibles(int ejemplaresDisponibles) {
    this.ejemplaresDisponibles = ejemplaresDisponibles;
}

@Override
public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((titulo == null) ? 0 : titulo.hashCode());
    result = prime * result + ((autor == null) ? 0 : autor.hashCode());
    result = prime * result + ((ISBN == null) ? 0 : ISBN.hashCode());
    result = prime * result + ejemplaresDisponibles;
    return result;
}

/**
* Compara este libro con otro objeto para determinar igualdad.
* Dos libros se consideran iguales si tienen el mismo ISBN.
*
* @param obj El objeto a comparar
* @return true si son iguales, false en caso contrario
*/
@Override
public boolean equals(Object obj) {
    if (this == obj)
        return true;
    if (obj == null)
        return false;
    if (getClass() != obj.getClass())
        return false;
    Libro other = (Libro) obj;
    if (titulo == null) {
        if (other.titulo != null)
            return false;
    } else if (!titulo.equals(other.titulo))
        return false;
    if (autor == null) {
        if (other.autor != null)
            return false;
    } else if (!autor.equals(other.autor))
        return false;
    if (ISBN == null) {
        if (other.ISBN != null)
            return false;
    } else if (!ISBN.equals(other.ISBN))
        return false;
    if (ejemplaresDisponibles != other.ejemplaresDisponibles)
        return false;
    return true;
}
/**
* Devuelve una representación en cadena del libro.
*
* @return Cadena con la información del libro formateada
*/
@Override
public String toString() {
    return "Libro [titulo=" + titulo + ", autor=" + autor + ", ISBN=" + ISBN + ", ejemplaresDisponibles="
            + ejemplaresDisponibles + "]";
}

 // Getters

 
}
