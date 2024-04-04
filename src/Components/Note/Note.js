import { useEffect, useState } from "react";
import { Button } from "../Button/Button";
import "./Note.css";

export function Note({
  id,
  title: initialTitle,
  content: initialContent,
  onSubmit,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaved, setIsSaved] = useState(false); // Ajout de l'état pour gérer l'affichage du libellé

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setIsSaved(false); // Assurez-vous que le libellé n'est pas affiché au chargement initial
  }, [id, initialTitle, initialContent]);

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
