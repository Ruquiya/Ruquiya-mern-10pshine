import React, { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import MainContent from '../components/MainContent/MainContent';
import CreateNote from '../components/Notes/CreateNote/CreateNote';
import CreateFolderModal from '../components/Folder/CreateFolderModal/CreateFolderModal';
import EditProfile from '../components/Header/EditProfile'; 

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showEditProfile, setShowEditProfile] = useState(false); 
  const [notes, setNotes] = useState([]);
  const [createNoteModal, setCreateNoteModal] = useState(false);
  const [folders, setFolders] = useState([]);
  const [createFolderModal, setCreateFolderModal] = useState(false);
  const [editingFolder, setEditingFolder] = useState(null);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .theme-transition * {
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
      .line-clamp-3 {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/folders', {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFolders(data);
      } else {
        console.error('Failed to fetch folders');
      }
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const fetchNotes = async (category = 'all') => {
    try {
      const token = localStorage.getItem('token');
      const url =
        category === 'trash'
          ? 'http://localhost:5000/api/notes?category=trash'
          : 'http://localhost:5000/api/notes';

      const res = await fetch(url, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const data = await res.json();
        setNotes(Array.isArray(data?.data) ? data.data : []);
      }
    } catch (e) {
      console.error('Failed to load notes', e);
    }
  };

  useEffect(() => {
    fetchFolders();
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchNotes(activeCategory);
  }, [activeCategory]);

  const handleSaveNote = async (newNote) => {
    try {
      await fetchNotes(); 
      setCreateNoteModal(false);
    } catch (error) {
      console.error('Error refreshing notes:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== noteId));
      if (selectedNote && selectedNote._id === noteId) {
        setSelectedNote(null);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        console.error('Failed to delete note from backend');
        await fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      await fetchNotes();
    }
  };

  const handleEditNote = (note) => {
    console.log('Edit note:', note);
    setSelectedNote(null);
  };

  const handleSaveFolder = async (folderData) => {
    try {
      await fetchFolders();
      setCreateFolderModal(false);
      setEditingFolder(null);
    } catch (error) {
      console.error('Error refreshing folders:', error);
    }
  };

  const handleEditFolder = (folder) => {
    setEditingFolder(folder);
    setCreateFolderModal(true);
  };

  const handleDeleteFolder = async (folderId) => {
    if (window.confirm('Are you sure you want to delete this folder? Notes will not be deleted.')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/folders/${folderId}`, {
          method: 'DELETE',
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });

        if (response.ok) {
          await fetchFolders();
        } else {
          console.error('Failed to delete folder');
        }
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  return (
    <div
      className={`min-h-screen theme-transition ${
        darkMode
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white'
          : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
      }`}
    >
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onCreateNote={() => setCreateNoteModal(true)}
        onCreateFolder={() => setCreateFolderModal(true)}
        onEditProfile={handleEditProfile}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isOpen={sidebarOpen}
          darkMode={darkMode}
          notes={notes}
          folders={folders}
          onCreateFolder={() => setCreateFolderModal(true)}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4 md:space-y-6">
          <MainContent
            activeCategory={activeCategory}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            searchTerm={searchTerm}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            darkMode={darkMode}
            sidebarOpen={sidebarOpen}
            onCreateNote={() => setCreateNoteModal(true)}
            onCreateFolder={() => setCreateFolderModal(true)}
            onEditFolder={handleEditFolder}
            onDeleteFolder={handleDeleteFolder}
            onEditNote={handleEditNote}
            onDeleteNote={handleDeleteNote}
            notes={notes}
            folders={folders}
            fetchNotes={fetchNotes}
            fetchFolders={fetchFolders}
          />
        </div>
      </div>

      {/* Modals*/}
      {createNoteModal && (
        <CreateNote
          darkMode={darkMode}
          onClose={() => setCreateNoteModal(false)}
          onSave={handleSaveNote}
          folders={folders}
        />
      )}

      {createFolderModal && (
        <CreateFolderModal
          darkMode={darkMode}
          onClose={() => {
            setCreateFolderModal(false);
            setEditingFolder(null);
          }}
          onSave={handleSaveFolder}
          folderToEdit={editingFolder}
          allNotes={notes}
        />
      )}

      {/* Edit Profile Modal*/}
      {showEditProfile && (
        <EditProfile
          isOpen={showEditProfile}
          onClose={() => setShowEditProfile(false)}
          darkMode={darkMode}
        />
      )}
    </div>
  );
};

export default Dashboard;