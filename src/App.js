import "./App.css";
import React, { useEffect, useState } from "react";
import { Button } from "./Components/Button/Button";
import { Note } from "./Components/Note/Note";
import { Loading } from "./Components/Loading/Loading";

function App() {
    // États
    const [isLoading, setIsLoading] = useState(true);
    const [notes, setNotes] = useState([]);
    const [selectedNoteId, setSelectedNoteId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedColor, setSelectedColor] = useState("#ffffff");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fonction pour récupérer les notes
    const fetchNotes = async () => {
        try {
            const response = await fetch("/notes");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement des notes");
            }
            const data = await response.json();
            setNotes(data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    // Fonction pour créer une nouvelle note
    const createNote = async () => {
        try {
            // Envoi d'une requête POST au serveur pour créer une nouvelle note
            const response = await fetch("/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: "Nouvelle note",
                    content: "",
                    lastUpdatedAt: new Date(),
                    checked: false,
                    color: selectedColor,
                }),
            });
            if (!response.ok) {
                throw new Error("Erreur lors de la création de la note");
            }
            const newNote = await response.json();
            setNotes([newNote, ...notes]);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

       // Fonction pour mettre à jour une note
       const refreshNote = async (id, updatedNote) => {
        try {
            const response = await fetch(`/notes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedNote),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de la note');
            }

            setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
        } catch (error) {
            setError(error.message);
        }
    };

    // Fonction pour gérer le changement de l'état checked d'une note
    const handleCheckboxChange = (isChecked, id) => {
        setNotes(
            notes.map((note) =>
                note.id === id ? { ...note, checked: isChecked } : note
            )
        );
    };

    // Fonction pour gérer le changement de couleur d'une note
    const handleColorChange = (color) => {
        setNotes(
            notes.map((note) =>
                note.id === selectedNoteId ? { ...note, color: color } : note
            )
        );
        setSelectedColor(color); // Mettre à jour la couleur sélectionnée
    };

    // Fonction pour gérer le changement de couleur lorsque la touche "Entrée" est enfoncée
    const handleColorKeyDown = (event) => {
        if (event.key === "Enter") {
            setSelectedColor(event.target.value);
            // Appeler la fonction pour mettre à jour la couleur de la note sélectionnée
            handleColorChange(event.target.value, selectedNoteId);
        }
    };

    // Fonction pour supprimer une note
    const removeNote = async (id) => {
        const response = await fetch(`/notes/${id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setNotes(notes.filter((note) => note.id !== id));
            if (selectedNoteId === id) setSelectedNoteId(null); // Désélectionner la note si elle est actuellement sélectionnée
        }
    };

    // Récupération de la note sélectionnée
    const selectedNote = notes && notes.find((note) => note.id === selectedNoteId);

// Filtre les notes par date de mise à jour
const filteredNotes = notes
    ? notes
        .filter(
            (note) =>
                note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => new Date(b.lastUpdatedAt) - new Date(a.lastUpdatedAt))
    : [];

    return (
        <>
            {/* Barre horizontale */}
            <hr className="Top" />

            {/* Barre de recherche */}
            <div className="Search-wrapper">
                <input
                    type="text"
                    placeholder="Search notes"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button
                        className="Clear-button"
                        onClick={() => setSearchQuery("")}
                    >
                        X
                    </button>
                )}
            </div>

            {/* Barre latérale sur le coté gauche pour afficher les titres */}
            <aside className="Side">
                {/* Création de nouvelle note */}
                <div className="Create-note-wrapper">
                    <Button onClick={createNote}>+ Create new note</Button>
                </div>
                {/* Chargement en cours */}
                {isLoading ? (
                    <div className="Loading-wrapper">
                        <Loading />
                    </div>
                ) : (
                    // Affichage des notes
                    notes?.map((note) => (
                        <div
                            key={note.id}
                            className={`Note-container ${
                                selectedNoteId === note.id ? "Note-selected" : ""
                            }`}
                            style={{ backgroundColor: note.color }} // Ajoutez la couleur de la note ici
                        >
                            {/* Titre de la note */}
                            <button
                                className={`NoteTitle-button ${
                                    selectedNoteId === note.id ? "NoteTitle-button-selected" : ""
                                }`}
                                onClick={() => {
                                    setSelectedNoteId(note.id);
                                    setShowColorPicker(true); // Afficher le sélecteur de couleur lorsque l'utilisateur sélectionne une note
                                }}
                                style={{ backgroundColor: note.color }} // Ajoutez la couleur de la note ici
                            >
                                {note.title}
                            </button>
                            {/* Case à cocher */}
                            <label>
                                <input
                                    type="checkbox"
                                    checked={note.checked}
                                    onChange={(event) =>
                                        handleCheckboxChange(event.target.checked, note.id)
                                    }
                                />
                            </label>
                            {/* Bouton de suppression */}
                            <div key={note.id} className="Note-button-container">
                                <button
                                    className="Remove-button"
                                    onClick={() => removeNote(note.id)}
                                >
                                    Supprimer
                                </button>
                            </div>

                            {/* Sélecteur de couleur pour la vignette */}
                            {selectedNoteId === note.id && showColorPicker && (
                                <div className="Color-picker-button">
                                    <input
                                        type="color"
                                        value={selectedNote ? selectedNote.color : selectedColor}
                                        onChange={(event) => handleColorChange(event.target.value)}
                                        onKeyDown={handleColorKeyDown} // Gestionnaire d'événements pour la touche "Entrée"
                                    />
                                </div>
                            )}

                        </div>
                    ))
                )}
            </aside>

            {/* Contenu principal */}
            <main className="Main">
                {selectedNote ? (
                    <Note
                        id={selectedNote.id}
                        title={selectedNote.title}
                        content={selectedNote.content}
                        checked={selectedNote.checked}
                        onSubmit={refreshNote}
                        color={selectedNote.color}
                    />
                ) : null}
            </main>

            {/* Affichage des erreurs */}
            {error && <div className="Error">{error}</div>}
        </>
    );
}

export default App;