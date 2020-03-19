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
      const history = await api.chat.history();
      commit('fillMessageHistory', history);
      commit('sectionUpdated', session.section);
      commit('subsectionUpdated', session.subsection);
      commit('cursorUpdated', session.cursor);
      commit('configUpdated', session.config);
    }
  } catch (err) {
    if (err.response && err.response.status === 404) {
      await dispatch('sendMessage', { cursor: common.enums.chatCursors.initialize });
    } else {
      throw err;
    }
  } finally {
    await commit('initialized');
  }
};

export const sendMessage = async ({ commit }, {
  cursor, section, subsection, message,
}) => {
  const isInitializing = cursor === common.enums.chatCursors.initialize;
  const myMessage = { id: uuid(), ...message };
  try {
    if (!isInitializing) commit('messageSent', myMessage);
    const {
      nextSection,
      nextSubsection,
      nextCursor,
      answers,
      config,
    } = await api.chat
      .answer({
        cursor,
        section,
        subsection,
        message: myMessage,
      });
    if (!isInitializing) commit('messageDelivered', myMessage.id);
    await emulateAnswersDelay(answers, commit);
    commit('sectionUpdated', nextSection);
    commit('subsectionUpdated', nextSubsection);
    commit('cursorUpdated', nextCursor);
    commit('configUpdated', config);
  } catch (err) {
    commit('messageFailed', { messageId: myMessage.id, error: err });
    throw err;
  }
};
