import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

export default function Libros() {
    const [books, setBooks] = useState([]);
    const [userProfile, setUserProfile] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBooksAndUserProfile = async () => {
            // Fetching books
            const { data: booksData, error: booksError } = await supabase
                .from("books")
                .select("*");
            if (booksError) {
                console.error("Error al obtener los libros:", booksError.message);
            } else {
                setBooks(booksData);
            }

            // Fetching user profile
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (profileData) setUserProfile(profileData);
        };

        const fetchAlertMessage = async () => {
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .eq('active', true)
                .order('id', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setAlertMessage({ message: data.message, type: data.type });
            }
        };

        fetchBooksAndUserProfile();
        fetchAlertMessage();
    }, []);

    const renderAlert = () => (
        alertMessage && (
            <div
                className={`flex items-start sm:items-center justify-center gap-3 px-4 py-3 text-sm font-medium w-full z-50 ${
                    alertMessage.type === 'info' ? 'bg-blue-100 text-blue-800' :
                    alertMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                    alertMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    alertMessage.type === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                }`}
            >
                <div className="text-left max-w-3xl">{alertMessage.message}</div>
            </div>
        )
    );

    const isValidImageUrl = (url) =>
        /^https?:\/\/\S+\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "https://www.w3schools.com/w3images/fjords.jpg";
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const navigationLinks = [
        { icon: "home.png", name: "Inicio", url: "/" },
        { icon: "libros.png", name: "Libros", url: "/libros" },
        { icon: "eventos.png", name: "Eventos", url: "/events" },
        { icon: "music.png", name: "Musica", url: "/music" },
        { icon: "https://images.encantia.lat/users2.png", name: "Usuarios", url: "/profiles" },
        { icon: "discord.png", name: "Discord", url: "https://discord.gg/BRqvv9nWHZ", external: true },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white p-4">
            {renderAlert()}

            <h1 className="text-3xl mb-6">📚 Libros Disponibles</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {books.length === 0 ? (
                    <div className="text-center text-gray-400 col-span-full">
                        No hay libros disponibles.
                    </div>
                ) : (
                    books.map((book) => (
                        <div
                            key={book.id}
                            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            {isValidImageUrl(book.portada_url) ? (
                                <div className="w-full h-64 bg-gray-600 rounded-lg overflow-hidden">
                                    <img
                                        src={book.portada_url}
                                        alt={book.title}
                                        className="w-full h-full object-contain"
                                        onError={handleImageError}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-600 rounded-lg flex items-center justify-center text-white">
                                    {book.portada_url ? "Portada no válida" : "Sin portada"}
                                </div>
                            )}
                            <h2 className="text-xl font-bold mt-3">{book.title}</h2>
                            <p className="text-gray-400">{book.description}</p>
                            {book.portada_url && (
                                <a
                                    href={book.portada_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline mt-2 block"
                                >
                                    Ver el libro
                                </a>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="fixed bottom-3 left-1/2 transform -translate-x-1/2 flex items-center bg-gray-900 p-2 rounded-full shadow-lg space-x-4 w-max">
                <img src="https://images.encantia.lat/encantia-logo-2025.webp" alt="Logo" className="h-13 w-auto" />

                {navigationLinks.map(({ icon, name, url, external }) => (
                    <div key={icon} className="relative group">
                        <button
                            onClick={() => external ? window.open(url, "_blank") : router.push(url)}
                            className="p-2 rounded-full bg-gray-800 text-white text-xl transition-transform transform group-hover:scale-110"
                        >
                            <img src={icon.startsWith('http') ? icon : `https://images.encantia.lat/${icon}`} alt={name} className="w-8 h-8" />
                        </button>
                        <span className="absolute bottom-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-xs rounded px-2 py-1 transition-opacity">
                            {name}
                        </span>
                    </div>
                ))}

                {userProfile && (
                    <div className="relative group">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2 rounded-full bg-gray-800 hover:scale-110 transition-transform"
                        >
                            <img
                                src={userProfile.avatar_url || 'https://i.ibb.co/d0mWy0kP/perfildef.png'}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full"
                            />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-lg shadow-md mt-2 w-40">
                                <button
                                    onClick={() => router.push(`/account`)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                >
                                    Configuración
                                </button>
                                <button
                                    onClick={() => router.push(`/profile/${userProfile.user_id}`)}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700"
                                >
                                    Ver mi perfil
                                </button>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-700"
                                >
                                    Cerrar sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-3 right-3 text-gray-400 text-xs bg-gray-900 p-2 rounded-md shadow-md">
                © 2025 by Encantia is licensed under CC BY-NC-ND 4.0.
            </div>
        </div>
    );
}
