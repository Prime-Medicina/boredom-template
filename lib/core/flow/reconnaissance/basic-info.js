const axios = require('axios');
const chatCursors = require('../../../common/enums/chat-cursors');
const { string: { getNumbers } } = require('../../../common/helpers');
const { states } = require('../../../common/lists');
const userService = require('../../user');
const sections = require('../../../common/enums/chat-sections');
const subsections = require('../../../common/enums/chat-subsections');

const section = sections.reconnaissance;
const subsection = subsections.basicInfo;

const questionFullName = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { name: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionNickName,
    messages: [
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

const questionNickName = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { nickName: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionNationality,
    messages: [
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

const questionNationality = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { nationality: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionCivilStatus,
    messages: ['Qual é seu estado civil?'],
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

const questionCivilStatus = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { civilStatus: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionProfession,
    messages: ['Qual é sua profissão?'],
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

const questionProfession = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { profession: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionRg,
    messages: ['Qual o número do seu RG?'],
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

const questionRg = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { rg: answer.content });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionCpf,
    messages: ['Qual é o número do seu CPF?'],
    config: {
      type: 'cpf',
      suggestion: updatedUser.cpf,
      hint: 'Digite apenas os números do seu CPF',
      required: true,
    },
  };
};

const questionCpf = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, { cpf: getNumbers(answer.content) });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCep,
    messages: [
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

const questionAddressCep = async ({ user, answer }) => {
  const cep = getNumbers(answer.content);
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
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressState,
    messages: ['Selecione seu estado'],
    config: {
      type: 'state',
      suggestion: updatedUser.address.uf,
      required: true,
    },
  };
};

const questionAddressState = async ({ user, answer }) => {
  const state = states.brazil.find((s) => s.fu === answer.content);
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, state: state.name, uf: state.fu },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressCity,
    messages: ['Qual é o nome da sua cidade?'],
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

const questionAddressCity = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, city: answer.content },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressNeighborhood,
    messages: ['Qual é o nome do seu bairro?'],
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

const questionAddressNeighborhood = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, neighborhood: answer.content },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressStreet,
    messages: ['Qual é o nome da sua rua?'],
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

const questionAddressStreet = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, street: answer.content },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressNumber,
    messages: ['Qual é o número da sua residência?'],
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

const questionAddressNumber = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, number: answer.content },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionAddressComplement,
    messages: ['Existe algum complemento para o seu endereço?'],
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

const questionAddressComplement = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    address: { ...user.address, complement: answer.content },
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionMotherName,
    messages: [
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

const questionMotherName = async ({ user, answer }) => {
  const updatedUser = await userService.updateUser(user.id, {
    motherName: answer.content,
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionFatherName,
    messages: [
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

const questionFatherName = async ({ user, answer }) => {
  await userService.updateUser(user.id, {
    fatherName: answer.content,
  });
  return {
    nextSection: section,
    nextSubsection: subsection,
    nextCursor: chatCursors.reconnaissance.basicInfo.questionPhones,
    messages: [
      'Qual e o número do seu telefone?',
    ],
    config: {
      type: 'phones',
      hint: 'Insira o número do seu telefone com o DDD',
      minLength: 14,
      maxLength: 15,
      required: true,
    },
  };
};

module.exports = (cursor, context) => {
  switch (cursor) {
    case chatCursors.reconnaissance.basicInfo.questionFullName:
      return questionFullName(context);
    case chatCursors.reconnaissance.basicInfo.questionNickName:
      return questionNickName(context);
    case chatCursors.reconnaissance.basicInfo.questionNationality:
      return questionNationality(context);
    case chatCursors.reconnaissance.basicInfo.questionCivilStatus:
      return questionCivilStatus(context);
    case chatCursors.reconnaissance.basicInfo.questionProfession:
      return questionProfession(context);
    case chatCursors.reconnaissance.basicInfo.questionRg:
      return questionRg(context);
    case chatCursors.reconnaissance.basicInfo.questionCpf:
      return questionCpf(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressCep:
      return questionAddressCep(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressState:
      return questionAddressState(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressCity:
      return questionAddressCity(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressNeighborhood:
      return questionAddressNeighborhood(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressStreet:
      return questionAddressStreet(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressNumber:
      return questionAddressNumber(context);
    case chatCursors.reconnaissance.basicInfo.questionAddressComplement:
      return questionAddressComplement(context);
    case chatCursors.reconnaissance.basicInfo.questionMotherName:
      return questionMotherName(context);
    case chatCursors.reconnaissance.basicInfo.questionFatherName:
      return questionFatherName(context);
    default:
      throw new Error(`Invalid cursor "${cursor}" for section "${section}" and subsection "${subsection}"`);
  }
};
