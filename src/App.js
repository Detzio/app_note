import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "./Components/Button/Button";
import { Note } from "./Components/Note/Note";
import { Loading } from "./Components/Loading/Loading";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [error, setError] = useState(null); // Ajout de l'état pour gérer les erreurs

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

  const createNote = async () => {
    try {
      const response = await fetch("/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "Nouvelle note",
          content: "",
          lastUpdatedAt: new Date(),
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

  const refreshNote = async (id, { title, content, lastUpdatedAt }) => {
    try {
      const response = await fetch(`/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          lastUpdatedAt: new Date(),
        }),
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la modification de la note");
      }
      const updatedNote = await response.json();
      setNotes(
        notes.map((note) =>
          note.id === id ? { id, title, content, lastUpdatedAt } : note
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const selectedNote =
    notes && notes.find((note) => note.id === selectedNoteId);

  return (
    <>
      <aside className="Side">
        <div className="Create-note-wrapper">
          <Button onClick={createNote}>+ Create new note</Button>
        </div>
        {isLoading ? (
          <div className="Loading-wrapper">
            <Loading />
          </div>
        ) : (
          notes?.map((note) => (
            <button
              className={`Note-button ${
                selectedNoteId === note.id ? "Note-button-selected" : ""
              }`}
              key={note.id}
              onClick={() => {
                setSelectedNoteId(note.id);
              }}
            >
              {note.title}
            </button>
          ))
        )}
      </aside>
      <main className="Main">
        {selectedNote ? (
          <Note
            id={selectedNote.id}
            title={selectedNote.title}
            content={selectedNote.content}
            onSubmit={refreshNote}
          />
        ) : null}
      </main>
      {error && <div className="Error">{error}</div>} {/* Affichage de l'erreur */}
    </>
  );
}

export default App;
