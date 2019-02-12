# google-places-autocomplete

This package will let you use google places API to autocomplete a existing address form

## Usage

```js
const Vue = require('vue')
const googleAutocompleteDirective = require('google-places-autocomplete');

// TODO: DEMONSTRATE API
Vue.use(GooglePlacesAutoComplete, {
  key: process.env.GOOGLE_API_KEY
})
```

Default directive use
```html
<template>
  <section class="shipping-form">
    <form
      action="#"
      novalidate
      @submit.prevent="submit"
      v-google-places-autocomplete >
      <div class="input-group addressLine">
        <label for="addressLine">{{ $t('shipping-form.labels.addressLine') }}</label>
        <input
          type="text" 
          name="addressLine"
          id="addressLine"
          v-model="address.addressLine" >
      </div>
      <div class="input-group addressLine2">
        <label for="addressLine2">{{ $t('shipping-form.labels.addressLine2') }}</label>
        <input type="text" name="addressLine2" id="addressLine2" v-model="address.addressLine2" >
      </div>
      <div class="input-group country">
        <label for="country">{{ $t('shipping-form.labels.country') }}</label>
        <country-selector
          :name="'country'"
          :id="'country'"
          v-model="address.country.code" />
      </div>
      <div class="input-group state">
        <label for="state">{{ $t('shipping-form.labels.state') }}</label>
        <state-selector
          :country="address.country.code"
          :name="'state'"
          :id="'state'"
          v-model="address.state.code" />
      </div>
      <div class="input-group city">
        <label for="city">{{ $t('shipping-form.labels.city') }}</label>
        <input
          type="text"
          name="city"
          id="city"
          v-model="address.city" />
      </div>
      <div class="input-group postal">
        <label for="postal">{{ $t('shipping-form.labels.postal.' + postalCodeKey) }}</label>
        <input
          type="text"
          name="postal"
          id="postal"
          v-model="address.postal" >
      </div>
      <div class="input-group phone">
        <label for="phone">{{ $t('shipping-form.labels.phone') }}</label>
        <input
          type="tel"
          name="phone"
          id="phone"
          v-model="phone">
      </div>
      <div class="shipping-form__actions group-actions">
        <ub-button
          buttonType="primary"
          buttonSize=""
          :actionName="submitText"
          :disabled="disableButton"
          :buttonLoading="loading">
        </ub-button>
        <ub-button
          buttonType="secondary"
          buttonSize=""
          :actionName="$t('cancel')"
          :disabled="loading"
          :onClick="cancel">
        </ub-button>
      </div>
    </form>
  </section>
</template>
```