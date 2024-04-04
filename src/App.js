import React, { useEffect, useState } from "react";
import "./App.css";

function App() {
  // États pour gérer les données de l'application
  const [isLoading, setIsLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [notes, setNotes] = useState(null); // Liste des notes
  const [currentNote, setCurrentNote] = useState(null); // Note actuellement sélectionnée
  const [newTitle, setNewTitle] = useState(""); // Nouveau titre de la note
  const [newContent, setNewContent] = useState(""); // Nouveau contenu de la note

  // Fonction pour récupérer les notes depuis le serveur
  const fetchNotes = async () => {
    const response = await fetch("/notes");
    const data = await response.json();

    setNotes(data);
    setIsLoading(false);
  };

  // Effet pour charger les notes au chargement de l'application
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fonction pour ajouter une nouvelle note
  const addNote = async () => {
    try {
      const response = await fetch("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Nouvelle note",
          content: "",
        }),
      });
      const newNote = await response.json();

      setNotes([newNote, ...notes]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note :", error);
    }
  };

  // Fonction pour mettre à jour le titre d'une note
  const updateTitle = async () => {
    if (!currentNote || !newTitle.trim()) return;

    try {
      const response = await fetch(`/notes/${currentNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTitle,
          content: currentNote.content,
        }),
      });
      const updatedNote = await response.json();

      setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
      setNewTitle(""); // Réinitialiser le champ de saisie du titre après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre de la note :", error);
    }
  };

  // Fonction pour mettre à jour le contenu d'une note
  const updateContent = async () => {
    if (!currentNote || !newContent.trim()) return;

    try {
      const response = await fetch(`/notes/${currentNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: currentNote.title,
          content: newContent,
        }),
      });
      const updatedNote = await response.json();

      setNotes(notes.map((note) => (note.id === updatedNote.id ? updatedNote : note)));
      setNewContent(""); // Réinitialiser le champ de saisie du contenu après la mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contenu de la note :", error);
    }
  };

  // Rendu de l'application
  return (
    <>
      {/* Barre latérale avec la liste des notes */}
      <aside className="Side">
        {/* Bouton pour ajouter une nouvelle note */}
        <button className="Add-button" onClick={addNote}>+</button>
        {/* Liste des notes */}
        {isLoading ? (
          "Chargement…"
        ) : (
          <div className="Note-list">
            {notes?.map((note) => (
              <button
                className="Note-button"
                key={note.id}
                onClick={() => setCurrentNote(note)}
              >
                {note.title}
              </button>
            ))}
          </div>
        )}
      </aside>
      {/* Section principale pour afficher et modifier les notes */}
      <main className="Main">
        {/* Affichage des champs de saisie et du contenu de la note sélectionnée */}
        {currentNote && (
          <>
            {/* Champ de saisie pour le titre */}
            <input
              type="text"
              value={newTitle}
              placeholder="Modifier le titre"
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") updateTitle();
              }}
            />
            {/* Champ de saisie pour le contenu */}
            <textarea
              value={newContent}
              placeholder="Modifier le contenu"
              onChange={(e) => setNewContent(e.target.value)}
            />
            {/* Bouton d'enregistrement du contenu */}
            <button onClick={updateContent}>Enregistrer</button>
            {/* Affichage du contenu de la note */}
            <div className="Note-content">{currentNote.content}</div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
