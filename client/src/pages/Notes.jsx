import React, { useEffect, useState } from "react";
import SidePanel from "../components/SidePanel";
import NoteForm from "../components/NoteForm";
import axios from "axios";
import NoteCard from "../components/NoteCard";
import NoteDetails from "../components/NoteDetails";

function Notes() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [defaultTitle, setDefaultTitle] = useState("");
  const [isNoteDetailsOpen, setIsNoteDetailsOpen] = useState(false);
  const [noteToOpen, setNoteToOpen] = useState(null);
  function closeForm() {
    setIsFormOpen(false);
  }
  function openNoteDetails(note) {
    setIsNoteDetailsOpen(true);
    setNoteToOpen(note);
  }
  function closeNoteDetails() {
    setIsNoteDetailsOpen(false);
  }
  async function updateNote(note, noteTitle, content) {
    const id = note.id;
    try {
      const response = await axios.put(
        `${API_URL}/note/update/${id}`,
        {
          title: noteTitle,
          content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        console.log("Note updated successfully");
        fetchNotes();
        setIsNoteDetailsOpen(false);
      } else {
        console.log("Failed to update the notes " + response.data);
      }
    } catch (error) {
      console.log("Error " + error);
    }
  }
  async function fetchNotes() {
    try {
      const response = await axios.get(`${API_URL}/note/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      if (response.status == 200) {
        setNotes(response.data.allNotes);
        setDefaultTitle(response.data.defaultTitle);
      } else {
        console.log("Failed to fetch all notes " + response.data);
      }
    } catch (error) {
      console.log("Error " + error);
    } finally {
      setLoading(false);
    }
  }
  async function checkAsDone(note) {
    const id = note.id;
    try {
      const response = await axios.put(
        `${API_URL}/note/change/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        fetchNotes();
      } else {
        console.log("Something went wrong " + response.data);
      }
    } catch (error) {
      console.log("Error " + error);
    }
  }
  async function deleteNote(note) {
    const id = note.id;
    try {
      const response = await axios.delete(`${API_URL}/note/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        console.log("Note removed successfully");
        fetchNotes();
      } else {
        console.log("Failed to remove the note " + response.data);
      }
    } catch (error) {
      console.log("Error " + error);
    }
  }
  useEffect(() => {
    fetchNotes();
  }, []);
  if (loading) return <div>Loading secure session...</div>;
  return (
    <div>
      <div className="grid grid-cols-[25%_75%] min-h-screen gap-50">
        <SidePanel pageName={"Notes"} />
        <div className="mt-15 flex flex-col gap-10 pr-80">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-extrabold">Notes</h1>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-lightgray px-12 py-2 rounded-2xl cursor-pointer"
            >
              New note
            </button>
          </div>
          <div className="relative w-full ">
            <img
              src="search.png"
              alt="icon"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search notes"
              className="pl-12 focus:outline-none w-full px-5 py-3 rounded-2xl bg-lightgray"
            />
          </div>
          {notes.map((note) => (
            <NoteCard
              note={note}
              checkAsDone={checkAsDone}
              deleteNote={deleteNote}
              openNoteDetails={openNoteDetails}
            />
          ))}
        </div>
      </div>
      {isNoteDetailsOpen && (
        <NoteDetails
          note={noteToOpen}
          closeNoteDetails={closeNoteDetails}
          updateNote={updateNote}
        />
      )}
      {isFormOpen && (
        <NoteForm
          closeForm={closeForm}
          fetchNotes={fetchNotes}
          defaultTitle={defaultTitle}
        />
      )}
    </div>
  );
}

export default Notes;
