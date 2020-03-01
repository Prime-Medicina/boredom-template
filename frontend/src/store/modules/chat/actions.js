import { v4 as uuid } from 'uuid';
import { wait } from 'juriscloud/common/helpers/promise';
import { randomIntFromInterval } from 'juriscloud/common/helpers/math';
import { common } from 'juriscloud';
import * as api from '@/api';

const wrapAnswer = (answer) => ({
  content: answer,
  from: 'bot',
  timestamp: Date.now(),
});

const calculateTypingTime = (text) => Array(text.length).fill(null)
  .reduce((acc) => acc + randomIntFromInterval(5, 40), 0);

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
      commit('configUpdated', session.currentConfig);
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      await dispatch('sendMessage', { cursor: common.enums.chatCursors.initialize });
    } else {
      throw err;
    }
  } finally {
    commit('initialized');
  }
};

export const sendMessage = async ({ commit }, { cursor, message }) => {
  const isInitializing = cursor === common.enums.chatCursors.initialize;
  const myMessage = { id: uuid(), ...message };
  try {
    if (!isInitializing) commit('messageSent', myMessage);
    const { cursor: nextCursor, answers, config } = await api.chat
      .answer(cursor, myMessage);
    if (!isInitializing) commit('messageDelivered', myMessage.id);
    await emulateAnswersDelay(answers, commit);
    commit('cursorUpdated', nextCursor);
    commit('configUpdated', config);
  } catch (err) {
    commit('messageFailed', { messageId: myMessage.id, error: err });
    throw err;
  }
};
