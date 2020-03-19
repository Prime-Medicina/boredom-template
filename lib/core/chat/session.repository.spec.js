const { v4: uuid } = require('uuid');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

const sessionRepository = require('./session.repository');

const userId = uuid();
let sessionId;

describe('#create', () => {
  it('Create a new session', async () => {
    const session = await sessionRepository.create(userId, 'cursor');
    sessionId = session.id;

    const persistedSession = await sessionRepository.retrieveOneByIdAndUserId(sessionId, userId);

    expect(persistedSession).toHaveProperty('id', sessionId);
    expect(persistedSession).toHaveProperty('userId', userId);
    expect(persistedSession).toHaveProperty('section', null);
    expect(persistedSession).toHaveProperty('subsection', null);
    expect(persistedSession).toHaveProperty('cursor', 'cursor');
    expect(persistedSession).toHaveProperty('config', {});
    expect(persistedSession).toHaveProperty('finished', false);
    expect(persistedSession.createdAt).toBeGreaterThan(0);
    expect(persistedSession.updatedAt).toBeGreaterThanOrEqual(persistedSession.createdAt);
  });
});

describe('#activate', () => {
  it('Activate the created session', async () => {
    await sessionRepository.activate(sessionId, userId);

    const activeSession = await sessionRepository.retrieveActiveByUserId(userId);

    expect(activeSession).toHaveProperty('id', sessionId);
    expect(activeSession).toHaveProperty('userId', userId);
    expect(activeSession).toHaveProperty('section', null);
    expect(activeSession).toHaveProperty('subsection', null);
    expect(activeSession).toHaveProperty('cursor', 'cursor');
    expect(activeSession).toHaveProperty('config', {});
    expect(activeSession).toHaveProperty('finished', false);
    expect(activeSession.createdAt).toBeGreaterThan(0);
    expect(activeSession.updatedAt).toBeGreaterThanOrEqual(activeSession.createdAt);
  });
});

describe('#retrieveOneByIdAndUserId', () => {
  it('Retrieve the created session', async () => {
    const session = await sessionRepository.retrieveOneByIdAndUserId(sessionId, userId);

    expect(session).toHaveProperty('id', sessionId);
    expect(session).toHaveProperty('userId', userId);
    expect(session).toHaveProperty('section', null);
    expect(session).toHaveProperty('subsection', null);
    expect(session).toHaveProperty('cursor', 'cursor');
    expect(session).toHaveProperty('config', {});
    expect(session).toHaveProperty('finished', false);
    expect(session.createdAt).toBeGreaterThan(0);
    expect(session.updatedAt).toBeGreaterThanOrEqual(session.createdAt);
  });
});

describe('#retrieveAllByUserId', () => {
  it('Retrieve all sessions by userId', async () => {
    const sessions = await sessionRepository.retrieveAllByUserId(userId);
    expect(sessions.length).toBeGreaterThan(0);
  });
});

describe('#update', () => {
  it('Update a session', async () => {
    const session = await sessionRepository.retrieveActiveByUserId(userId);
    await sessionRepository.update(session, {
      nextSection: 'nextSection',
      nextSubsection: 'nextSubsection',
      nextCursor: 'nextCursor',
      config: { foo: 'bar' },
      messages: ['Message 1', 'Message 2'],
      answer: {
        type: 'message',
        content: 'Answer content',
        from: 'User',
      },
    });
    const updatedSession = await sessionRepository.retrieveActiveByUserId(userId);

    expect(updatedSession).toHaveProperty('id', sessionId);
    expect(updatedSession).toHaveProperty('userId', userId);
    expect(updatedSession).toHaveProperty('section', 'nextSection');
    expect(updatedSession).toHaveProperty('subsection', 'nextSubsection');
    expect(updatedSession).toHaveProperty('cursor', 'nextCursor');
    expect(updatedSession).toHaveProperty('config', { foo: 'bar' });
    expect(updatedSession).toHaveProperty('finished', false);
    expect(updatedSession.createdAt).toBeGreaterThan(0);
    expect(updatedSession.updatedAt).toBeGreaterThanOrEqual(session.updatedAt);
  });
});
