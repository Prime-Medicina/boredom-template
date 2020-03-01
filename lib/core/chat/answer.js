const axios = require('axios');
const { chatCursors } = require('../../common/enums');
const { string: { getNumbers } } = require('../../common/helpers');
const { states } = require('../../common/lists');
const sessionManager = require('./session');
const userService = require('../user');

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

const questionFullName = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { name: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionNickName,
    answers: [
      'Certo, agora já não somos mais estranhos',
      'Como você prefere que eu te chame?',
    ],
    config: {
      type: 'text',
      hint: `Digite como você deseja ser chamado, ex.: ${updatedUser.name.split(' ')[0]}`,
      suggestion: updatedUser.nickName,
      minLength: 2,
      maxLength: 100,
      required: true,
    },
  };
};

const questionNickName = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { nickName: message.content });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionNationality,
    answers: [
      `Certo ${updatedUser.nickName}, agora preciso que você selecione sua nacionalidade`,
    ],
    config: {
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
    config: {
      type: 'choice',
      choices: [
        {
          label: 'Solteiro(a)',
          value: 'single',
        }, {
          label: 'Casado(a)',
          value: 'married',
        },
      ],
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
    config: {
      type: 'text',
      hint: 'Insira o nome da sua profissão',
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
    config: {
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
    config: {
      type: 'cpf',
      suggestion: updatedUser.cpf,
      hint: 'Digite apenas os números do seu CPF',
      required: true,
    },
  };
};

const questionCpf = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, { cpf: getNumbers(message.content) });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCep,
    answers: [
      'Agora precisamos dos dados do seu endereço',
      'Qual é seu CEP?',
    ],
    config: {
      type: 'cep',
      suggestion: updatedUser.address.cep,
      hint: 'Digite o CEP do seu endereço(apenas números)',
      required: true,
    },
  };
};

const questionAddressCep = async ({ user, message }) => {
  const cep = getNumbers(message.content);
  const addressFromCep = (await axios.get(`https://viacep.com.br/ws/${cep}/json/`)).data;
  const state = states.brazil.find((s) => s.fu === addressFromCep.uf);
  const updatedUser = await userService.updateUser(user.id, {
    address: {
      cep,
      street: addressFromCep.logradouro || undefined,
      neighborhood: addressFromCep.bairro || undefined,
      city: addressFromCep.localidade || undefined,
      uf: addressFromCep.uf || undefined,
      state: state ? state.name : undefined,
    },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressState,
    answers: ['Selecione seu estado'],
    config: {
      type: 'state',
      suggestion: updatedUser.address.uf,
      required: true,
    },
  };
};

const questionAddressState = async ({ user, message }) => {
  const state = states.brazil.find((s) => s.fu === message.content);
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, state: state.name, uf: state.fu },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCity,
    answers: ['Qual é o nome da sua cidade?'],
    config: {
      type: 'text',
      hint: 'Digite o nome da cidade onde você mora',
      suggestion: updatedUser.address.city,
      minLength: 2,
      maxLength: 150,
      required: true,
    },
  };
};

const questionAddressCity = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, city: message.content },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressNeighborhood,
    answers: ['Qual é o nome do seu bairro?'],
    config: {
      type: 'text',
      hint: 'Digite o nome do bairro onde você mora',
      suggestion: updatedUser.address.neighborhood,
      minLength: 2,
      maxLength: 150,
      required: true,
    },
  };
};

const questionAddressNeighborhood = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, neighborhood: message.content },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressStreet,
    answers: ['Qual é o nome da sua rua?'],
    config: {
      type: 'text',
      hint: 'Digite o nome da rua onde você mora',
      suggestion: updatedUser.address.street,
      minLength: 2,
      maxLength: 150,
      required: true,
    },
  };
};

const questionAddressStreet = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, street: message.content },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressNumber,
    answers: ['Qual é o número da sua residência?'],
    config: {
      type: 'number',
      hint: 'Digite o número da sua residência',
      suggestion: updatedUser.address.number,
      minLength: 1,
      maxLength: 7,
      required: true,
    },
  };
};

const questionAddressNumber = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, number: message.content },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressComplement,
    answers: ['Existe algum complemento para o seu endereço?'],
    config: {
      type: 'text',
      hint: 'Ex.: Apto 401',
      suggestion: updatedUser.address.complement,
      minLength: 0,
      maxLength: 200,
      required: false,
    },
  };
};

const questionAddressComplement = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, complement: message.content },
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionMotherName,
    answers: [
      'Só preciso de mais algumas informações antes de começar',
      'Qual é o nome completo da sua mãe?',
    ],
    config: {
      type: 'text',
      suggestion: updatedUser.motherName,
      minLength: 4,
      maxLength: 150,
      required: true,
    },
  };
};

const questionMotherName = async ({ user, message }) => {
  const updatedUser = await userService.updateUser(user.id, {
    motherName: message.content,
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionFatherName,
    answers: [
      'E o nome completo da seu pai?',
    ],
    config: {
      type: 'text',
      suggestion: updatedUser.fatherName,
      minLength: 4,
      maxLength: 150,
      required: true,
    },
  };
};

const questionFatherName = async ({ user, message }) => {
  await userService.updateUser(user.id, {
    fatherName: message.content,
  });
  return {
    nextCursor: chatCursors.reconnaissance.basicInfo.questionPhones,
    answers: [
      'Qual e o número do seu telefone?',
    ],
    config: {
      type: 'phone',
      hint: 'Insira o número do seu telefone com o DDD',
      minLength: 14,
      maxLength: 15,
      required: true,
    },
  };
};

module.exports = async ({ user, cursor, message = {} }) => {
  const userSession = (
    await sessionManager.retrieve(user.id) || await sessionManager.create(user.id)
  );

  const { isValid, errors } = validateRequirements(message, userSession.currentConfig);
  if (!isValid) return retry(userSession, errors);

  const context = {
    session: userSession,
    message,
    user,
  };

  let answers;
  let nextCursor;
  let config;

  switch (cursor) {
    case chatCursors.initialize:
      ({ answers, nextCursor, config } = await initialize(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionFullName:
      ({ answers, nextCursor, config } = await questionFullName(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionNickName:
      ({ answers, nextCursor, config } = await questionNickName(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionNationality:
      ({ answers, nextCursor, config } = await questionNationality(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionCivilStatus:
      ({ answers, nextCursor, config } = await questionCivilStatus(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionProfession:
      ({ answers, nextCursor, config } = await questionProfession(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionRg:
      ({ answers, nextCursor, config } = await questionRg(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionCpf:
      ({ answers, nextCursor, config } = await questionCpf(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressCep:
      ({ answers, nextCursor, config } = await questionAddressCep(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressState:
      ({ answers, nextCursor, config } = await questionAddressState(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressCity:
      ({ answers, nextCursor, config } = await questionAddressCity(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressNeighborhood:
      ({ answers, nextCursor, config } = await questionAddressNeighborhood(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressStreet:
      ({ answers, nextCursor, config } = await questionAddressStreet(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressNumber:
      ({ answers, nextCursor, config } = await questionAddressNumber(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionAddressComplement:
      ({ answers, nextCursor, config } = await questionAddressComplement(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionMotherName:
      ({ answers, nextCursor, config } = await questionMotherName(context)); break;
    case chatCursors.reconnaissance.basicInfo.questionFatherName:
      ({ answers, nextCursor, config } = await questionFatherName(context)); break;
    default:
      throw new Error('Invalid cursor');
  }

  await sessionManager.update(userSession, {
    cursor: nextCursor, config, answer: message, messages: answers,
  });

  return { cursor: nextCursor, answers, config };
};
