import uuid from 'uuid/v4';
import { wait } from '@/helpers/promise';
import { randomIntFromInterval } from '@/helpers/math';
import { common } from 'juriscloud';
import * as api from '@/api';

const wrapAnswer = (answer) => ({
  content: answer,
  from: 'bot',
  timestamp: Date.now(),
});

const calculateTypingTime = (text) => Array(text.length).fill(null)
  .reduce((acc) => acc + randomIntFromInterval(5, 30), 0);

const emulateAnswersDelay = async (answers, commit) => {
  for (const answer of answers) {
    commit('startedTyping');
    await wait(calculateTypingTime(answer));
    commit('messageReceived', wrapAnswer(answer));
  }
};

export const initialize = async ({ commit, dispatch, getters }) => {
  try {
    if (!getters.isInitialized) {
      const session = await api.chat.session();
      commit('fillMessageHistory', session.history);
      commit('cursorUpdated', session.currentCursor);
      commit('requirementsUpdated', session.currentRequirements);
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      await dispatch('sendMessage', { cursor: common.enums.chatCursors.initialize });
    }
    throw err;
  } finally {
    commit('initialized');
  }
};

export const sendMessage = async ({ commit }, { cursor, message }) => {
  const isInitializing = cursor === common.enums.chatCursors.initialize;
  const myMessage = { id: uuid(), ...message };
  if (!isInitializing) commit('messageSent', myMessage);
  const { cursor: nextCursor, answers, requirements } = await api.chat
    .answer(cursor, myMessage);
  if (!isInitializing) commit('messageDelivered', myMessage.id);
  await emulateAnswersDelay(answers, commit);
  commit('cursorUpdated', nextCursor);
  commit('requirementsUpdated', requirements);
};
