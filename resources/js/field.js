import IndexField from './components/GoogleAutocomplete/IndexField.vue';
import DetailField from './components/GoogleAutocomplete/DetailField.vue';
import FormField from './components/GoogleAutocomplete/FormField.vue';

import MetaDataIndexField from './components/AddressMetadata/IndexField.vue';
import MetaDataDetailField from './components/AddressMetadata/DetailField.vue';
import MetaDataFormField from './components/AddressMetadata/FormField.vue';

Nova.booting((app) => {
    app.component('index-google-autocomplete', IndexField);
    app.component('detail-google-autocomplete', DetailField);
    app.component('form-google-autocomplete', FormField);
    app.component('index-address-metadata', MetaDataIndexField);
    app.component('detail-address-metadata', MetaDataDetailField);
    app.component('form-address-metadata', MetaDataFormField);
});
