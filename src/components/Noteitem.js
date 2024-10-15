import React, { useContext } from 'react';
import noteContext from '../context/notes/noteContext';
//for correct token(matching)
const Noteitem = ({ note, updateNote, showAlert }) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;

    const isOwner = () => {
        const token = localStorage.getItem('token');
        console.log('token', token);
        if (!token) return false;
        const decodedToken = parseJwt(token);
        return decodedToken?.user.id?.toString() === note?.user?.toString();
    };

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    };

    return (
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        {isOwner() && (  //isowner ka function chalai tbh hi next show ho
                            <i
                                className="far fa-trash-alt mx-2"
                                onClick={() => {
                                    deleteNote(note._id);
                                    showAlert('Note Deleted Successfully!', 'success');
                                }}
                            ></i>
                        )}
                        {isOwner() && (
                            <i
                                className="far fa-edit mx-2"
                                onClick={() => {
                                    updateNote(note);
                                }}
                            ></i>
                        )}
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Noteitem;
