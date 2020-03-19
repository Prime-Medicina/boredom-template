import Vue from 'vue';
import wrapAnswer from 'juriscloud/common/models/chat-message';

export const initialized = (state) => {
  Vue.set(state, 'isInitialized', true);
};

export const startedTyping = (state) => {
  Vue.set(state, 'isTyping', true);
};

export const messageReceived = (state, message) => {
  Vue.set(state, 'isTyping', false);
  state.messages.push(message);
};

export const cursorUpdated = (state, cursor) => {
  Vue.set(state, 'cursor', cursor);
};

export const sectionUpdated = (state, section) => {
  Vue.set(state, 'section', section);
};

export const subsectionUpdated = (state, subsection) => {
  Vue.set(state, 'subsection', subsection);
};

export const configUpdated = (state, config) => {
  Vue.set(state, 'config', config);
};

export const messageSent = (state, message) => {
  state.messages.push({ delivered: false, failed: false, ...message });
};

export const messageDelivered = (state, messageId) => {
  const message = state.messages.find((msg) => msg.id === messageId);
  message.delivered = true;
};

export const messageFailed = (state, { messageId, error }) => {
  const message = state.messages.find((msg) => msg.id === messageId);
  if (message) {
    message.failed = true;
  }
  state.messages.push(wrapAnswer({
    type: 'error',
    content: 'Ocorreu um erro no servidor, tente novamente',
    from: 'bot',
  }));
  console.error('Server error', error.message);
};

export const fillMessageHistory = (state, messages) => {
  state.messages.push(...messages);
};
