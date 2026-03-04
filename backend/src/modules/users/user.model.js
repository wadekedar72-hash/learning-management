const db = require('../../config/db');

class UserModel {
  async findById(id) {
    return db('users').where('id', id).first();
  }

  async findByEmail(email) {
    return db('users').where('email', email).first();
  }

  async create(userData) {
    const [id] = await db('users').insert({
      email: userData.email,
      password_hash: userData.password_hash,
      name: userData.name,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return this.findById(id);
  }

  async update(id, updates) {
    updates.updated_at = new Date();
    await db('users').where('id', id).update(updates);
    return this.findById(id);
  }
}

module.exports = new UserModel();
