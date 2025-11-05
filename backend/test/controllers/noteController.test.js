// test/controllers/noteController.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const app = require('../../server');
const Note = require('../../models/Note');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);

describe('Note Controller', function() {
  let authToken;
  let userId;
  let testNote;

  before(async function() {
    this.timeout(10000);
    
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      const testDbUri = process.env.MONGO_URI || 'mongodb://localhost:27017/notes-app-test';
      await mongoose.connect(testDbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Test database connected in noteController test');
    }
    
    // Ensure JWT_SECRET is set for tests
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';
  });

  after(async function() {
    this.timeout(10000);
    // Cleanup is handled by setup.js, but we can add test-specific cleanup here if needed
  });

  beforeEach(async function() {
    this.timeout(5000);
    
    // First, create/ensure test user exists (after collections are cleared)
    await User.deleteMany({ email: 'test@example.com' });
    
    const hashedPassword = await bcrypt.hash('testpassword123', 10);
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
    await testUser.save();
    userId = testUser._id;

    // Generate auth token with the same secret used by auth middleware
    const jwtSecret = process.env.JWT_SECRET || 'test-secret-key';
    authToken = jwt.sign({ id: userId.toString() }, jwtSecret);
    
    // Create a test note before each test
    testNote = new Note({
      title: 'Test Note',
      content: 'Test content',
      type: 'text',
      folder: 'General',
      user: userId
    });
    await testNote.save();
  });

  describe('POST /api/notes', function() {
    it('should create a new note', function(done) {
      this.timeout(5000);
      
      const newNote = {
        title: 'New Test Note',
        content: 'New test content',
        type: 'text',
        folder: 'General'
      };

      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newNote)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('title', newNote.title);
          expect(res.body.data).to.have.property('content', newNote.content);
          expect(res.body.data).to.have.property('user', userId.toString());
          done();
        });
    });

    it('should not create a note without title', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Content without title' })
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(500); // This might be 400 depending on your validation
          done();
        });
    });

    it('should require authentication', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .post('/api/notes')
        .send({ title: 'Test', content: 'Test' })
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  describe('GET /api/notes', function() {
    it('should get all notes for authenticated user', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.be.an('array');
          expect(res.body.data.length).to.be.at.least(1);
          done();
        });
    });

    it('should filter deleted notes by default', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          res.body.data.forEach(note => {
            expect(note.isDeleted).to.not.equal(true);
          });
          done();
        });
    });
  });

  describe('GET /api/notes/:id', function() {
    it('should get a single note by ID', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .get(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('title', testNote.title);
          expect(res.body.data).to.have.property('_id', testNote._id.toString());
          done();
        });
    });

    it('should return 404 for non-existent note', function(done) {
      this.timeout(5000);
      
      const fakeId = new mongoose.Types.ObjectId();
      chai.request(app)
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });

  describe('PUT /api/notes/:id', function() {
    it('should update a note', function(done) {
      this.timeout(5000);
      
      const updates = {
        title: 'Updated Title',
        content: 'Updated content'
      };

      chai.request(app)
        .put(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data).to.have.property('title', updates.title);
          expect(res.body.data).to.have.property('content', updates.content);
          done();
        });
    });
  });

  describe('DELETE /api/notes/:id', function() {
    it('should soft delete a note (move to trash)', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .delete(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          
          // Verify note is soft deleted
          Note.findById(testNote._id).then(note => {
            expect(note.isDeleted).to.be.true;
            expect(note.deletedAt).to.not.be.null;
            done();
          }).catch(done);
        });
    });
  });

  describe('PATCH /api/notes/:id/pin', function() {
    it('should toggle pin status', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .patch(`/api/notes/${testNote._id}/pin`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data.pinned).to.be.true;
          done();
        });
    });
  });

  describe('PATCH /api/notes/:id/important', function() {
    it('should toggle important status', function(done) {
      this.timeout(5000);
      
      chai.request(app)
        .patch(`/api/notes/${testNote._id}/important`)
        .set('Authorization', `Bearer ${authToken}`)
        .end((err, res) => {
          if (err) return done(err);
          
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.data.important).to.be.true;
          done();
        });
    });
  });
});