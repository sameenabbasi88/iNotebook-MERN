import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = ({ children }) => {
  const host = "http://localhost:5000"
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  // Get all Notes
  const getNotes = async () => { //request bhejain gain backend pai
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, { //url ko fetch krai ga
      method: 'GET', //jo backend pai likha hoga 
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token') //javascript ki apni databse hai wo check krai ga yai token hai ya nhi
      }
    });
    const json = await response.json(); 
    console.log("All Notes", json);
    setNotes(json);
  }

  // Add a Note
  const addNote = async (title, description) => {

    // API Call 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description }) //stringify ka mtlb string mai convert kr do
    });

    const note = await response.json();
    console.log("New Note", note);
    setNotes(notes.concat(note));
  }

  // Delete a Note
  const deleteNote = async (id) => {
    // API Call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = response.json();
    console.log("Deleted Note", json);
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
  }

  // Edit a Note
  const editNote = async (id, title, description) => {
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description })
    });
    const json = await response.json();
    console.log("Updated Note", json);
    let newNotes = JSON.parse(JSON.stringify(notes));
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        break;
      }
    }
    setNotes(newNotes);
    console.log("After Updation (All Notes)!", newNotes);
  }

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {children}
    </NoteContext.Provider>
  )

}
export default NoteState;