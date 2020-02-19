import uuid from 'uuid/v4';
import { wait } from '@/helpers/promise';
import { randomIntFromInterval } from '@/helpers/math';
import { common } from 'juriscloud';
import * as api from '@/api';

const wrapAnswer = (answer) => ({
  text: answer,
  from: 'bot',
  timestamp: Date.now(),
});

const emulateAnswersDelay = async (answers, commit) => {
  for (const answer of answers) {
    commit('startedTyping');
    await wait(randomIntFromInterval(350, 800));
    commit('messageReceived', wrapAnswer(answer));
  }
};

export const initialize = async ({ dispatch }) => dispatch('sendMessage', {
  cursor: common.enums.enquireCursors.reconnaissance.initialize,
});

export const sendMessage = async ({ commit }, { cursor, message }) => {
  const isInitializing = cursor === common.enums.enquireCursors.reconnaissance.initialize;
  const myMessage = { id: uuid(), ...message };
  if (!isInitializing) commit('messageSent', myMessage);
  const { cursor: nextCursor, answers, requirements } = await api.enquirer
    .answer(cursor, myMessage);
  if (!isInitializing) commit('messageDelivered', myMessage.id);
  commit('cursorUpdated', nextCursor);
  commit('requirementsUpdated', requirements);
  await emulateAnswersDelay(answers, commit);
};
