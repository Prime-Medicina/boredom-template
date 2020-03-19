const chatCursors = require('../../../common/enums/chat-cursors');
const sessionRepository = require('../../chat/session.repository');

module.exports = async ({ user, session }) => {
  await sessionRepository.activate(session.id, user.id);

  const { fullyRegistered } = user;
  if (fullyRegistered) {
    return {
      // TODO
    };
  }
  return {
    nextSection: 'reconnaissance',
    nextSubsection: 'basicInfo',
    nextCursor: chatCursors.reconnaissance.basicInfo.questionFullName,
    messages: [
      'Bem vindo à JurisCloud!',
      'Vejo que você é novo aqui, precisarei coletar algumas informações para concluir seu cadástro',
      'Por favor, confirme seu nome completo',
    ],
    config: {
      type: 'text',
      hint: 'Insira seu nome completo',
      suggestion: user.name,
      minLength: 4,
      maxLength: 150,
      required: true,
    },
  };
};
