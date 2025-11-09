const biblioteca = [];

// Función para buscar libros (ahora muestra hasta 10 resultados)
function buscarLibro() {
    const titulo = document.getElementById("busqueda").value;
    fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(titulo)}&limit=10`)  // Limitamos la búsqueda a 10 resultados
        .then(response => response.json())
        .then(data => {
            if (data.docs && data.docs.length > 0) {
                const libros = data.docs.slice(0, 10); // Tomamos los primeros 10 libros
                mostrarResultados(libros);  // Mostrar los resultados
            } else {
                document.getElementById("resultado").innerHTML = "<p>No se encontraron resultados.</p>";
            }
        })
        .catch(error => console.error("Error al obtener los datos:", error));
}

// Mostrar los resultados de búsqueda
function mostrarResultados(libros) {
    let resultadoHTML = "<h3>Resultados:</h3>";
    libros.forEach((libro, index) => {
        const tituloLibro = libro.title;
        const autorLibro = libro.author_name ? libro.author_name.join(", ") : "Autor desconocido";
        resultadoHTML += `
            <p>
                ${index + 1}. ${tituloLibro} de ${autorLibro}
                <button onclick="agregarLibro('${tituloLibro}', '${autorLibro}')">Añadir a Biblioteca</button>
            </p>
        `;
    });
    document.getElementById("resultado").innerHTML = resultadoHTML;
}

// Función para agregar un libro a la biblioteca
function agregarLibro(titulo, autor) {
    biblioteca.push({ titulo, autor });
    mostrarBiblioteca();
}

// Función para mostrar la biblioteca guardada
function mostrarBiblioteca() {
    const divBiblioteca = document.getElementById("biblioteca");
    divBiblioteca.innerHTML = "<h2>Biblioteca</h2>";
    if (biblioteca.length === 0) {
        divBiblioteca.innerHTML += "<p>No tienes libros en tu biblioteca.</p>";
    } else {
        biblioteca.forEach((libro, index) => {
            divBiblioteca.innerHTML += `<p>${index + 1}. ${libro.titulo} de ${libro.autor}</p>`;
        });
    }
}

// Función para guardar la biblioteca en LocalStorage
function guardarBiblioteca() {
    localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
    alert("Biblioteca guardada.");
}

// Función para cargar y ver la biblioteca guardada desde LocalStorage
function verBiblioteca() {
    const bibliotecaGuardada = JSON.parse(localStorage.getItem("biblioteca"));
    if (bibliotecaGuardada && bibliotecaGuardada.length > 0) {
        let bibliotecaHTML = "<h2>Biblioteca Guardada</h2>";
        bibliotecaGuardada.forEach((libro, index) => {
            bibliotecaHTML += `<p>${index + 1}. ${libro.titulo} de ${libro.autor}</p>`;
        });
        document.getElementById("biblioteca").innerHTML = bibliotecaHTML;
    } else {
        document.getElementById("biblioteca").innerHTML = "<p>No tienes libros guardados en la biblioteca.</p>";
    }
}

// Función para exportar los libros guardados a un archivo CSV
function exportarCSV() {
    const csvContent = "Título,Autor\n" + biblioteca.map(libro => `"${libro.titulo}","${libro.autor}"`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "biblioteca.csv";
    link.click();
}
