import React, { useContext, useState, useRef, useEffect } from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = ({ showAlert }) => {
    const context = useContext(noteContext); //hook
    const { addNote } = context;
    const inputRef = useRef(null);
    const [note, setNote] = useState({ title: "", description: "" });

    const handleSubmit = (event) => {
        event.preventDefault();
        addNote(note.title, note.description);
        setNote({ title: "", description: "" });
        showAlert("Note Added Successfully!", "success");
        inputRef.current.focus(); // Focus the title input field again
    };

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    return (
        <div className="container my-3">
            <h2>Add a Note</h2>
            <form className="my-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                        ref={inputRef}
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        aria-describedby="emailHelp"
                        value={note.title}
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        name="description"
                        value={note.description}
                        onChange={onChange}
                        minLength={5}
                        required
                    />
                </div>
                <button
                    disabled={note.title.length < 5 || note.description.length < 5}
                    className="btn btn-primary"
                >
                    Add Note
                </button>
            </form>
        </div>
    );
};

export default AddNote;
