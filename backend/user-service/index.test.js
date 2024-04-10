import request from 'supertest';
import app from './index';

// Mock the sendResetPasswordEmail function
jest.mock('./nodemailer', () => ({
    sendResetPasswordEmail: jest.fn().mockReturnValue(true),
}));

// Mock the Mongoose model
jest.mock('mongoose', () => {
    const mongoose = jest.requireActual('mongoose');
    mongoose.connect = jest.fn();
    mongoose.model = jest.fn(() => ({
        findOne: jest.fn().mockImplementation((query) => {
            if (query.email === 'test@gmail.com') {
              return Promise.resolve({ email: 'test@gmail.com', name: 'Test User', isAdmin: true });
            } else {
              return Promise.resolve(null);
            }
          }),
      }));
    mongoose.connection = jest.fn(() => ({
        on: jest.fn(),
    }));
    return mongoose;
});

// Mock jwt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn().mockImplementation((token, secret, callback) => {
    if (token === 'validToken') {
      callback(null, { email: 'test@gmail.com', name: 'Test User' });
    } else {
      callback(new Error('Invalid token'));
    }
  }),
  // Add other jwt methods if needed
}));

describe('Express App', () => {
  it('should respond with a 404 status for an unknown route', async () => {
    const res = await request(app).get('/unknown-route');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toHaveProperty('message', 'Route Not Found');
  });

  it('should respond with a 200 status for /api/auth/verify', async () => {
    const res = await request(app)
      .get('/api/auth/verify')
      .set('Authorization', 'Bearer validToken');

    expect(res.statusCode).toEqual(200);
  });

  it('should respond with a 200 status for /api/user', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('authorization', 'Bearer validToken')
      .send({ email: 'test@gmail.com' });

    expect(res.statusCode).toEqual(200);
  });
});