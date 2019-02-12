'use strict';
const GoogleMapsApiLoader = require('google-maps-api-loader')

const defaultOptions = {
  types: ['address']
}

function createInputEvent (type = 'input') {
  return new Event(type)
}

const GMAP = {
  street_number: 'addressLine',
  route: 'addressLine',
  locality: 'city',
  sublocality_level_1: 'city',
  administrative_area_level_1: 'state',
  country: 'country',
  postal_code: 'postal'
}

function directiveFactory (GoogleToAppMapper) {
  GoogleToAppMapper = GoogleToAppMapper ?  GoogleToAppMapper : GMAP
  return {
    update (el, binding, vnode) {
      const setComponentRestrictions = typeof binding.value === 'object' && binding.value.restrictions ? binding.value.restrictions : undefined
      if (setComponentRestrictions) {
        vnode.autocomplete.setComponentRestrictions(setComponentRestrictions)
      }
    },
    bind (el, binding, vnode) {
      const autoCompleteElement = typeof binding.value === 'object' && binding.value.autoCompleteElement ? binding.value.autoCompleteElement : 'addressLine'
      const optionsParams = typeof binding.value === 'object' && binding.value.options ? binding.value.options : {}
      const setComponentRestrictions = typeof binding.value === 'object' && binding.value.restrictions ? binding.value.restrictions : undefined
      const mapper = typeof binding.value === 'object' && binding.value.GoogleToAppMapper
        ? binding.value.GoogleToAppMapper
        : GoogleToAppMapper

      const options = Object.assign({}, defaultOptions, optionsParams)
      const autocompleteValue = typeof binding.value === 'object' && binding.value.randomAutocomplete 
        ? () => 'a' + +(new Date())
        : () => 'off'
      const autoCompleteNode = el.querySelector(`input[name=${autoCompleteElement}]`)
      vnode.autocomplete = new google.maps.places.Autocomplete(
        autoCompleteNode,
        options
      )
      if (setComponentRestrictions) {
        vnode.autocomplete.setComponentRestrictions(setComponentRestrictions)
      }
      el.setAttribute('autocomplete', autocompleteValue())
      for (const element of el.elements) {
        if (element.type !== 'submit' && element.name !== 'phone' && !/.*_fake/.test(element.id)) {
          element.setAttribute('autocomplete', autocompleteValue())
        }
      }
      vnode.autocomplete.addListener('place_changed', function () {
        const place = vnode.autocomplete.getPlace()
        convertGoogleAddressToForm(mapper, el, place.address_components)
        autoCompleteNode.focus()
        autoCompleteNode.blur()
      })
      if (typeof binding.value === 'object' && binding.value.randomAutocomplete ) {
        setTimeout(function () {
          autoCompleteNode.setAttribute('autocomplete', autocompleteValue())
        }, 500)
        autoCompleteNode.addEventListener('click', function () {
          autoCompleteNode.setAttribute('autocomplete', autocompleteValue())
        })
      }
    }
  }
}

function convertGoogleAddressToForm (mapper, el, placeComponents) {
  const elementsArray = Array.from(el.elements)
  const newAddress = placeComponents.reduce(createAddress.bind(null, mapper), {})
  Object.keys(newAddress).forEach(setElementValues.bind(null, newAddress, elementsArray))
}

function createAddress (mapper, address, component) {
  const key = mapper[component.types.find(t => mapper[t])]
  if (key) {
    address[key] = address[key] ? address[key] + ' ' + component.short_name : component.short_name
  }
  return address
}

function setElementValues (newAddress, elementsArray, key) {
  const inputEl = elementsArray.find(e => e.name === key)
  if (!inputEl) return
  inputEl.value = newAddress[key]
  inputEl.dispatchEvent(createInputEvent())
}

function install (Vue, opts) {
  opts = opts ? opts : {}
  const directiveName = opts.directiveName || 'google-places-autocomplete'
  const libraries = opts.libraries || ['places']
  const directive = directiveFactory(opts.GoogleToAppMapper)
  GoogleMapsApiLoader({ libraries, apiKey: opts.key })
    .then((googleApi) => {
      directive.googleApi = googleApi
      Vue.directive(directiveName, directive)
    })
}

exports.install = install
