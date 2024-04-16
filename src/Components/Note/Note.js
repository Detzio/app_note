import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import "./Note.css";

// Définition du hook personnalisé useDebouncedEffect en dehors du composant
export const useDebouncedEffect = (effect, deps, delay) => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);
    return () => clearTimeout(handler);
  }, [...(deps || []), delay]);
};

export function Note({
  id,
  title: initialTitle,
  content: initialContent,
  onSubmit,
  checked,
  color // Ajoutez la prop color
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false);
console.log(color);
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [id, initialTitle, initialContent]);

  useEffect(() => {
    setIsSaved(false);
  }, [id]);

  // Utilisation du hook personnalisé pour enregistrer automatiquement les modifications d'une note
  useDebouncedEffect(
    () => {
      updateNote();
    },
    [title, content, color, checked],
    3000 // Délai de 3 secondes
  );

  const updateNote = async () => {
    const response = await fetch(`/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
        lastUpdatedAt: new Date(),
        color: color,
        checked
      }),
    });

    const updatedNote = await response.json();
    onSubmit(id, updatedNote);
    setIsSaved(true); // Afficher le libellé après l'enregistrement de la modification
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
    setIsSaved(false); // Cacher le libellé lorsque le titre est modifié à nouveau
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    setIsSaved(false); // Cacher le libellé lorsque le contenu est modifié à nouveau
  };

  return (
    <form
      className="Form"
      onSubmit={(event) => {
        event.preventDefault();
        updateNote();
      }}
    >
      <input
        className="Note-editable Note-title"
        type="text"
        value={title}
        onChange={handleTitleChange}
      />
      <textarea
        className="Note-editable Note-content"
        value={content}
        onChange={handleContentChange}
      />
      <div className="Note-actions">
        <Button>Enregistrer</Button>
        {isSaved && <span>Enregistré ✅</span>} {/* Affichage du libellé si la note est enregistrée */}
      </div>
    </form>
  );
}
