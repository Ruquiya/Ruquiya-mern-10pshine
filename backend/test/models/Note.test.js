const expect = require('chai').expect;
const Note = require('../../models/Note');
const mongoose = require('mongoose');

describe('Note Model', function() {
  let userId;

  before(function() {
    userId = new mongoose.Types.ObjectId();
  });

  describe('Validation', function() {
    it('should require a title', async function() {
      this.timeout(5000);
      
      const note = new Note({
        content: 'Test content',
        user: userId,
      });

      let validationError = null;
      try {
        await note.validate();
      } catch (err) {
        validationError = err;
      }

      expect(validationError).to.not.be.null;
      expect(validationError.errors.title).to.exist;
    });

    it('should require a user', async function() {
      this.timeout(5000);
      
      const note = new Note({
        title: 'Test Note',
        content: 'Test content',
      });

      let validationError = null;
      try {
        await note.validate();
      } catch (err) {
        validationError = err;
      }

      expect(validationError).to.not.be.null;
      expect(validationError.errors.user).to.exist;
    });

    it('should create a note with valid data', async function() {
      this.timeout(5000);
      
      const note = new Note({
        title: 'Test Note',
        content: 'Test content',
        type: 'text',
        folder: 'General',
        user: userId,
      });

      let validationError = null;
      try {
        await note.validate();
      } catch (err) {
        validationError = err;
      }

      expect(validationError).to.be.null;
      expect(note.title).to.equal('Test Note');
    });
  });

  describe('Default Values', function() {
    it('should have default type as text', function() {
      const note = new Note({
        title: 'Test Note',
        user: userId,
      });
      expect(note.type).to.equal('text');
    });

    it('should have default folder as General', function() {
      const note = new Note({
        title: 'Test Note',
        user: userId,
      });
      expect(note.folder).to.equal('General');
    });

    it('should have default isDeleted as false', function() {
      const note = new Note({
        title: 'Test Note',
        user: userId,
      });
      expect(note.isDeleted).to.equal(false);
    });

    it('should have default pinned as false', function() {
      const note = new Note({
        title: 'Test Note',
        user: userId,
      });
      expect(note.pinned).to.equal(false);
    });

    it('should have default important as false', function() {
      const note = new Note({
        title: 'Test Note',
        user: userId,
      });
      expect(note.important).to.equal(false);
    });
  });

  describe('Type Validation', function() {
    it('should accept valid note types', function() {
      const validTypes = ['text', 'todo', 'code', 'drawing', 'audio', 'link'];
      
      validTypes.forEach(type => {
        const note = new Note({
          title: 'Test Note',
          type: type,
          user: userId,
        });
        expect(note.type).to.equal(type);
      });
    });
  });
});
