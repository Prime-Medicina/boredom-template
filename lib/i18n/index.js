import Mustache from 'mustache'
import * as langs from './langs'
import config from '../config'

const lang = config.LANGUAGE

const resolve = (term, params) => {
  let dictionary = langs[lang]
  if (!dictionary) throw new Error(`No dictionary for language "${lang}"`)
  let dictionaryTerm = dictionary[term]
  if (!dictionaryTerm) dictionaryTerm = langs['en'][term] // Always fallback to "en"
  if (!dictionaryTerm) throw new Error(`No dictionary term for "${term}"`)
  return Mustache.render(dictionaryTerm, params)
}

export { resolve }
