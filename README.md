# Nova Google AutoComplete Field Package

[![Latest Version](https://img.shields.io/github/release/hnooz/nova-google-map-autocomplete?style=flat-square)](https://github.com/hnooz/nova-google-map-autocomplete/releases)
[![Total Downloads](https://img.shields.io/packagist/dt/hnooz/nova-google-map-autocomplete?style=flat-square)](https://packagist.org/packages/hnooz/nova-google-map-autocomplete)

This field allows you to work with Google Places API to autocomplete on user input and get the full real address with all the metadata (like latitude and longitude).

Originally created by Emiliano Tisato and later maintained by Yield Studio as
[yieldstudio/nova-google-autocomplete](https://github.com/yieldstudio/nova-google-autocomplete),
which is no longer maintained. This package is its actively maintained continuation.

## Requirements

- PHP 8.3+
- Laravel Nova 5

| Package | PHP  | Nova |
|---------|------|------|
| 3.x     | 8.3+ | 5.x  |
| 1.x–2.x | 8.0+ | 5.x  |

## Installation

You can install the package into a Laravel app that uses Nova via composer:

```bash
composer require hnooz/nova-google-map-autocomplete
```

Now publish config and localization files:

```shell
php artisan vendor:publish --provider="Hnooz\NovaGoogleAutocomplete\FieldServiceProvider"
```

In the [Google Cloud Console](https://console.cloud.google.com/apis/library), enable the **Maps JavaScript API** and **Places API**, then create an API key under Credentials.

Add the below to your `.env` file

```shell
NOVA_GOOGLE_AUTOCOMPLETE_API_KEY=############################
```

## Usage

Add the use declaration to your resource and use the fields:

```php
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;
// ....

GoogleAutocomplete::make('Address'),

//You can add a country or countries to autocomplete or leave empty for all.

// Specify a single country
GoogleAutocomplete::make('Address')
          ->countries('US'),

// Specify multiple countries [array]
GoogleAutocomplete::make('Address')
          ->countries(['US','SA']),
```

You can access other parameter like `latitude, longitude, street_number, route, locality, administrative_area_level_1, country, postal_code`, along with every field present in the [PlaceResult object](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)

```php
use Hnooz\NovaGoogleAutocomplete\AddressMetadata;
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;

// Now this address field will search and store the address as a string, but also made available the values in the withValues array
GoogleAutocomplete::make('Address')->withValues(['latitude', 'longitude']),

// And you can store the values by autocomplete like this
AddressMetadata::make('lat')->fromValue('latitude'),
AddressMetadata::make('long')->fromValue('longitude'),

// You can disable the field so the user can't edit the metadata
AddressMetadata::make('long')->fromValue('longitude')->disabled(),

// Or you can make the field invisible in the form but collect the data anyways
AddressMetadata::make('long')->fromValue('longitude')->invisible(),
```

By default, the formatted address will be stored on the property provided in the GoogleAutocomplete field. If you don't want to store it, you can use the `dontStore` method:


```php
use Hnooz\NovaGoogleAutocomplete\AddressMetadata;
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;

// Formatted address will not be stored
GoogleAutocomplete::make('Address')->withValues(['latitude', 'longitude'])->dontStore(),

// This field will be stored
AddressMetadata::make('lat')->fromValue('latitude'),
AddressMetadata::make('long')->fromValue('longitude'),
```

### Combine Values

If you want to concatenate certain elements of the geocoded object that is returned by Google, using `{{` and `}}`, wrap the key like you would above; like so:

```php
use Hnooz\NovaGoogleAutocomplete\AddressMetadata;
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;

GoogleAutocomplete::make('Address')->withValues(['latitude', 'longitude']),

AddressMetadata::make('coordinates')->fromValue('{{latitude}}, {{longitude}}'),
```

So the value that would be rendered within the coordinates input would be something like:

```
39.3315476, -94.9363912
```

### Define Short/Long Value

If you would like to use the **long_name** version of the geocoded object (Kansas versus KS), you can define the `GoogleAutocomplete` field values with dot notation followed with the name version you want to use; like so:

```php
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;

GoogleAutocomplete::make('Address')
    ->withValues([
        'route.short_name',
        'administrative_area_level_1.long_name',
    ]),
```

Which would return:

**route:** W 143rd St

**administrative_area_level_1:** Kansas

You can change the type of places that are returned by the autocomplete using the placeType() method.  You can use any of the values listed in [Google's supported place types](https://developers.google.com/maps/documentation/places/web-service/supported_types)

```php
use Hnooz\NovaGoogleAutocomplete\AddressMetadata;
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;

// This autocomplete field will return results that match a business name instead of address.
// All the same address data is still stored.
GoogleAutocomplete::make('Address')->placeType('establishment');
```

### Capturing all values as JSON

If you want to capture all requested values as a JSON object, you can use the `fromValuesAsJson()` helper instead of using `fromValue()`.

```php
use Hnooz\NovaGoogleAutocomplete\AddressMetadata;
use Hnooz\NovaGoogleAutocomplete\GoogleAutocomplete;
use Laravel\Nova\Fields\Code;

// Autocomplete field
GoogleAutocomplete::make('Location')
    ->countries('BE')
    ->withValues(['latitude', 'longitude', 'street_number', 'route', 'locality', 'administrative_area_level_1', 'country', 'postal_code']),

// Field that will capture the response object
AddressMetadata::make('Address')
    ->fromValuesAsJson()
    ->invisible()
    ->onlyOnForms(),

// Display the response object in a Code field
Code::make('Address')->json()->onlyOnDetail(),
```

## Localization
If you want this package in your language, just create a json lang file in your `resources/lang/vendor/nova-google-autocomplete` folder.

## Development

```bash
npm install
npm run build        # dist/ is shipped with the package and must be committed
npm run lint
composer ci-check    # pint + rector (dry run), as enforced by CI
```

Installing Composer dependencies requires Nova credentials:

```bash
composer config http-basic.nova.laravel.com <username> <license-key>
```

## Credits
- Emiliano Tisato - Original author (2018)
- [James Hemery](https://github.com/jameshemery) - Yield Studio version
- [Mohamed Idris](https://github.com/hnooz) - Maintainer

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
