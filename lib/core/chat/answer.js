const sessionRepository = require('./session.repository');
const flow = require('../flow');

const validateRequirements = (message, config) => {
  let isValid = true;
  const errors = [];

  if (!config) return { isValid, errors };

  if (config.required && (!message.content || !String(message.content).length)) {
    isValid = false; errors.push('Esta resposta é obrigatória');
  }

  const { content } = message;
  const contentLength = (message.content !== null && message.content !== undefined)
    ? String(message.content).length
    : 0;

  if (config.type === 'text' || config.type === 'number') {
    if (config.type === 'number' && !Number.isInteger(Number(content))) {
      isValid = false; errors.push('Esta resposta deve ser numérica');
    }
    if ((config.minLength > 0) && (contentLength < config.minLength)) {
      isValid = false; errors.push(`O tamanho mínimo desta resposta é ${config.minLength}, ${contentLength}`);
    }
    if ((config.maxLength > 0) && (contentLength > config.maxLength)) {
      isValid = false; errors.push(`O tamanho máximo desta resposta é ${config.minLength}`);
    }
  }

  return { isValid, errors };
};

const retry = (session, errors) => ({
  nextCursor: session.currentCursor,
  config: session.currentConfig,
  answers: [
    `A resposta não passou em algumas validações: [${errors.join(', ')}]`,
    'Por favor, verifique a resposta e tente novamente',
  ],
});

module.exports = async ({
  section,
  subsection,
  cursor,
  user,
  message: answer = {},
}) => {
  const userSession = (
    await sessionRepository.retrieveActiveByUserId(user.id)
    || await sessionRepository.create(user.id, cursor)
  );

  const { isValid, errors } = validateRequirements(answer, userSession.config);
  if (!isValid) return retry(userSession, errors);

  const context = {
    session: userSession,
    answer,
    user,
  };

  const {
    nextSection,
    nextSubsection,
    nextCursor,
    config,
    messages,
  } = await flow({
    section, subsection, cursor, context,
  });

  await sessionRepository.update(userSession, {
    nextSection,
    nextSubsection,
    nextCursor,
    config,
    messages,
    answer,
  });

  return {
    nextSection,
    nextSubsection,
    nextCursor,
    messages,
    config,
  };
};
