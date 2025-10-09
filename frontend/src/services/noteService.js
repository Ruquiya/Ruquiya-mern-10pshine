const API_URL = 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    console.log(` API Call: ${endpoint}`, config);
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      let errorMessage = 'Unknown error';
      if (typeof data === 'object' && data.message) {
        errorMessage = data.message;
      } else if (typeof data === 'string') {
        errorMessage = data;
      }
      
      throw new Error(`API error: ${response.status} - ${errorMessage}`);
    }

    return data;
  } catch (error) {
    console.error(' API request failed:', error);
    
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
    
    throw error;
  }
};

export const noteService = {

  createNote: async (noteData) => {
    return apiRequest('/notes', {
      method: 'POST',
      body: noteData
    });
  },


  getNotes: async () => {
    return apiRequest('/notes');
  },


  getNote: async (noteId) => {
    if (!noteId || noteId.length < 10) {
      throw new Error('Invalid note ID');
    }
    return apiRequest(`/notes/${noteId}`);
  },


  updateNote: async (noteId, noteData) => {
    if (!noteId || noteId.length < 10) {
      throw new Error('Invalid note ID');
    }
    return apiRequest(`/notes/${noteId}`, {
      method: 'PUT',
      body: noteData
    });
  },

 
  deleteNote: async (noteId) => {
    if (!noteId || noteId.length < 10) {
      throw new Error('Invalid note ID');
    }
    
    console.log(` Attempting to delete note: ${noteId}`);
    return apiRequest(`/notes/${noteId}`, {
      method: 'DELETE'
    });
  },

  togglePin: async (noteId) => {
    if (!noteId || noteId.length < 10) {
      throw new Error('Invalid note ID');
    }
    return apiRequest(`/notes/${noteId}/pin`, {
      method: 'PATCH'
    });
  },


  toggleImportant: async (noteId) => {
    if (!noteId || noteId.length < 10) {
      throw new Error('Invalid note ID');
    }
    return apiRequest(`/notes/${noteId}/important`, {
      method: 'PATCH'
    });
  }
};


export const testConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/debug`);
    const data = await response.json();
    console.log(' Connection test:', data);
    return data;
  } catch (error) {
    console.error(' Connection test failed:', error);
    throw error;
  }
};