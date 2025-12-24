import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AlertBanner from "../components/AlertBanner"; // Importa el componente

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("title", { ascending: true });

      if (error) console.error("Error fetching books:", error.message);
      else setBooks(data);

      setLoading(false);
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p>Cargando libros...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <AlertBanner /> {/* Banner de avisos */}
      <Navbar />

      <main className="w-full max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.length === 0 ? (
          <p className="text-center col-span-full text-gray-300">No hay libros disponibles.</p>
        ) : (
          books.map((book) => (
            <div
              key={book.id}
              className="bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col"
            >
              {book.portada_url && (
                <img
                  src={book.portada_url}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                <p className="text-gray-300 flex-1 mb-4">{book.description}</p>
                {book.link && (
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-center"
                  >
                    Leer libro
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </main>
      <Footer />
    </div>
  );
}
