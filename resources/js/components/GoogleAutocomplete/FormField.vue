<template>
    <DefaultField
        :field="field"
        :errors="errors"
        :show-help-text="showHelpText"
        :full-width-content="fullWidthContent"
    >
        <template #field>
            <vue-google-autocomplete
                ref="searchField"
                :id="field.attribute"
                class="w-full form-control form-input form-input-bordered"
                :class="errorClasses"
                :country="field.countries"
                :types="field.type"
                :placeholder="placeholder"
                v-model="search"
                v-on:keypress.enter.prevent=""
                v-on:placechanged="getAddressData"
            />
            <div v-if="!field.dontStore && value && value.trim().length > 0">
                <span class="inline-block mt-1 italic">{{
                    __('nga_current_address', { address: value })
                }}</span>
                <button @click="clear" type="button" class="text-red-500 inline-block ml-2">
                    {{ __('nga_clear') }}
                </button>
            </div>
        </template>
    </DefaultField>
</template>

<script>
import { FormField, HandlesValidationErrors } from 'laravel-nova';
import VueGoogleAutocomplete from 'vue-google-autocomplete';

export default {
    components: { VueGoogleAutocomplete },
    mixins: [FormField, HandlesValidationErrors],
    props: ['resourceName', 'resourceId', 'field'],
    data: function () {
        return {
            search: '',
            value: '',
        };
    },
    computed: {
        placeholder() {
            if (this.field.placeholder) {
                return this.field.placeholder;
            }

            return this.__('nga_search');
        },
    },
    methods: {
        clear() {
            this.$refs.searchField.$refs.autocomplete.value = '';
            this.value = '';
            Nova.$emit('address-metadata-clear');
        },
        getAddressData(addressData, placeResultData) {
            this.handleChange(placeResultData.formatted_address);
            this.$refs.searchField.$refs.autocomplete.value = '';

            const retrievedAddress = {};

            this.field.addressObject.forEach((element) => {
                if (element.indexOf('.') < 0) {
                    if (Object.prototype.hasOwnProperty.call(addressData, element)) {
                        retrievedAddress[element] = addressData[element];
                    }
                    if (Object.prototype.hasOwnProperty.call(placeResultData, element)) {
                        retrievedAddress[element] = placeResultData[element];
                    }
                } else {
                    const [value, type] = element.split('.');
                    for (const component of placeResultData.address_components) {
                        if (component.types.includes(value)) {
                            retrievedAddress[value] = component[type];
                        }
                    }
                }
            });

            Nova.$emit('address-metadata-update', {
                attribute: this.field.attribute,
                ...retrievedAddress,
            });
        },

        setInitialValue() {
            this.value = this.field.value || '';
        },
        fill(formData) {
            formData.append(this.field.attribute, this.value || '');
        },
        handleChange(value) {
            this.value = value;
        },
    },
};
</script>
