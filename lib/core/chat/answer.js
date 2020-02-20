const axios = require('axios');
const { chatCursors } = require('../../common/enums');
const sessionManager = require('./session');
const userService = require('../user');

const validateRequirements = (message, requirements) => {
  let isValid = true;
  const errors = [];

  if (!requirements) return { isValid, errors };

  if (requirements.required && (!message.content || !String(message.content).length)) {
    isValid = false; errors.push('Esta resposta é obrigatória');
  }

  const { content } = message;
  const contentLength = (message.content !== null && message.content !== undefined)
    ? String(message.content).length
    : 0;

  if (requirements.type === 'text' || requirements.type === 'number') {
    if (requirements.type === 'number' && !Number.isInteger(Number(content))) {
      isValid = false; errors.push('Esta resposta deve ser numérica');
    }
    if ((requirements.minLength > 0) && (contentLength < requirements.minLength)) {
      isValid = false; errors.push(`O tamanho mínimo desta resposta é ${requirements.minLength}, ${contentLength}`);
    }
    if ((requirements.maxLength > 0) && (contentLength > requirements.maxLength)) {
      isValid = false; errors.push(`O tamanho máximo desta resposta é ${requirements.minLength}`);
    }
  }

  return { isValid, errors };
};

const retry = (session, errors) => ({
  nextCursor: session.currentCursor,
  requirements: session.currentRequirements,
  answers: [
    `A resposta não passou em algumas validações: [${errors.join(', ')}]`,
    'Por favor, verifique a resposta e tente novamente',
  ],
});

const initialize = ({ user }) => {
  const { fullyRegistered } = user;
  if (fullyRegistered) {
    return {
      // TODO
    };
  }
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionFullName,
    answers: [
      'Bem vindo à Juriscloud!',
      'Vejo que você é novo aqui, precisarei coletar algumas informações para concluir seu cadástro',
      'Por favor, confirme seu nome completo',
    ],
    requirements: {
      type: 'text',
      hint: 'Insira seu nome completo',
      suggestion: user.name,
      minLength: 4,
      maxLength: 100,
      required: true,
    },
  };
};

const questionFullName = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { name: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionNationality,
    answers: [
      `É um prazer em conhece-lo, ${message.content}`,
      'Agora preciso que você selecione sua nacionalidade',
    ],
    requirements: {
      type: 'nationality',
      hint: 'Selecione seu país de nacionalidade',
      suggestion: updatedUser.nationality,
      required: true,
    },
  };
};

const questionNationality = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { nationality: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionCivilStatus,
    answers: ['Qual é seu estado civil?'],
    requirements: {
      type: 'civil_status',
      suggestion: updatedUser.civilStatus,
      required: true,
    },
  };
};

const questionCivilStatus = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { civilStatus: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionProfession,
    answers: ['Qual é sua profissão?'],
    requirements: {
      type: 'text',
      suggestion: updatedUser.profession,
      minLength: 2,
      maxLength: 200,
      required: true,
    },
  };
};

const questionProfession = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { profession: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionRg,
    answers: ['Qual o número do seu RG?'],
    requirements: {
      type: 'number',
      hint: 'Insira apenas os números do seu RG',
      suggestion: updatedUser.rg,
      minLength: 4,
      maxLength: 14,
      required: true,
    },
  };
};

const questionRg = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { rg: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionCpf,
    answers: ['Qual é o número do seu CPF?'],
    requirements: {
      type: 'cpf',
      suggestion: updatedUser.cpf,
      hint: 'Digite apenas os números do seu CPF',
      required: true,
    },
  };
};

const questionCpf = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { cpf: message.content });
  const hasCep = !!updatedUser.cep;
  const answers = hasCep ? [] : [
    'Agora precisamos dos dados do seu endereço',
    'Qual é seu CEP?',
  ];

  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCep,
    answers,
    requirements: {
      type: 'cep',
      suggestion: updatedUser.cep,
      hint: 'Digite o CPF do seu endereço(apenas números)',
      required: true,
    },
  };
};

const questionAddressCep = async ({ user, message }) => {
  const addressFromCep = await axios.get(`viacep.com.br/ws/${message.content()}/json/`);
  await userService.updateUser(user.id, {
    address: {
      cep: message.content,
      street: addressFromCep.logradouro,
      neighborhood: addressFromCep.bairro,
      city: addressFromCep.localidade,
      state: addressFromCep.uf,
    },
  });

  let formattedAddress = addressFromCep.logradouro;
  formattedAddress += addressFromCep.complemento ? `, ${addressFromCep.complemento}` : '';
  formattedAddress += '\n';
  formattedAddress += addressFromCep.bairro;
  formattedAddress += `${addressFromCep.localidade} - ${addressFromCep.uf}`;
  formattedAddress += addressFromCep.cep.replace('-', '');

  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.suggestAddress,
    answers: ['Este endereço está correto?'],
    requirements: {
      type: 'yes_no',
      text: formattedAddress,
      required: true,
    },
  };
};

const suggestAddress = async ({ message, session }) => {
  if (String(message.content) !== 'true') {
    return {
      nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCep,
      requirements: session.currentRequirements,
      answers: [
        'Certo, vamos tentar novamente',
        'Confira se o número do CEP está correto e insira apenas os números',
      ],
    };
  }

  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.confirmAddress,
    answers: [],
    requirements: null,
  };
};

const confirmAddress = async () => ({
});

module.exports = async ({ user, cursor, message = {} }) => {
  const userSession = (
    await sessionManager.retrieve(user.id) || await sessionManager.create(user.id)
  );

  const { isValid, errors } = validateRequirements(message, userSession.currentRequirements);
  if (!isValid) return retry(userSession, errors);

  const context = {
    session: userSession,
    message,
    user,
  };

  let answers;
  let nextCursor;
  let requirements;

  switch (cursor) {
    case chatCursors.initialize:
      ({ answers, nextCursor, requirements } = await initialize(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionFullName:
      ({ answers, nextCursor, requirements } = await questionFullName(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionNationality:
      ({ answers, nextCursor, requirements } = await questionNationality(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionCivilStatus:
      ({ answers, nextCursor, requirements } = await questionCivilStatus(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionProfession:
      ({ answers, nextCursor, requirements } = await questionProfession(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionRg:
      ({ answers, nextCursor, requirements } = await questionRg(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionCpf:
      ({ answers, nextCursor, requirements } = await questionCpf(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressCep:
      ({ answers, nextCursor, requirements } = await questionAddressCep(context)); break;
    case chatCursors.reconnaissance.basicInfo.suggestAddress:
      ({ answers, nextCursor, requirements } = await suggestAddress(context)); break;
    case chatCursors.reconnaissance.basicInfo.confirmAddress:
      ({ answers, nextCursor, requirements } = await confirmAddress(context)); break;
    default:
      throw new Error('Invalid cursor');
  }

  await sessionManager.update(userSession, {
    cursor: nextCursor, requirements, answer: message.content, messages: answers,
  });

  return { cursor: nextCursor, answers, requirements };
};
