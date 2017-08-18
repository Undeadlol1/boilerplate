import React, { Component } from 'react'
import { IntlProvider, addLocaleData } from 'react-intl'
import enData from 'react-intl/locale-data/en'
import ruData from 'react-intl/locale-data/ru'
import ukData from 'react-intl/locale-data/uk'
import { connect } from 'react-redux'
import cookies from 'cookies-js'
import en from '../i18n/en'
import ru from '../i18n/ru'
import uk from '../i18n/uk'

addLocaleData([...enData, ...ruData, ...ukData]);

const DEFAULT_LANGUAGE = 'ru'

// TODO refactor everything

const messages = { en, ru, uk }

if (process.env.SERVER) {
// https://formatjs.io/guides/runtime-environments/#server
// var areIntlLocalesSupported = require('intl-locales-supported');
// var localesMyAppSupports = ['en', 'ru'];

// if (global.Intl) {
//     // Determine if the built-in `Intl` has the locale data we need.
//     if (!areIntlLocalesSupported(localesMyAppSupports)) {
//         // `Intl` exists, but it doesn't have the data we need, so load the
//         // polyfill and replace the constructors with need with the polyfill's.
//         require('intl');
//         Intl.NumberFormat   = IntlPolyfill.NumberFormat;
//         Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
//     }
// } else {
//     // No `Intl`, so use and load the polyfill.
//     global.Intl = require('intl');
// }
}

// placeholder to be able to export function later down the code
// because this function only being defined in "render" method
let translate = id => {
    return messages[DEFAULT_LANGUAGE][id]
}

function detectLocale() {
    if (process.env.BROWSER) {
        const localeCookie = cookies.get('locale')
        if (localeCookie) return localeCookie
    }
    const ret = navigator
                ? (navigator.languages && navigator.languages[0])
                || navigator.language
                || navigator.userLanguage
                : DEFAULT_LANGUAGE
    return ret || DEFAULT_LANGUAGE
}

@connect(
	({user}, ownProps) => {
        const userSettingsLocale = user.getIn(['Profile', 'language'])
        // const userSettingsLocale = user.toJS()
		return { userSettingsLocale, ...ownProps}
    }
)
class Translator extends Component {
    /*
        Sometimes req.locale.language and navigator.language are not the same.
        So, we are setting up 'locale' cookie in browsers language preference
        Then we will use this info as main language preference
    */
    componentWillMount() {
        if (process.env.BROWSER && !cookies.get('locale')) {
            cookies.set('locale', detectLocale())
        }
    }
    /**
     * get navigator.language or cookies.locale
     * @returns String (ie. 'en', or 'en-EN')
     * @memberOf Translator
     */

    render() {
        let language;

        const {userSettingsLocale} = this.props
        // Different browsers have the user locale defined
        // on different fields on the `navigator` object, so we make sure to account
        // for these different by checking all of them
        const preferedLanguage = userSettingsLocale || detectLocale()

        // Split locales with a region code (ie. 'en-EN' to 'en')
        const languageWithoutRegionCode = preferedLanguage.toLowerCase().split(/[_-]+/)[0];
        if (!messages.hasOwnProperty(languageWithoutRegionCode)) language = 'ru'
        else language = languageWithoutRegionCode
        /**
         * translates message
         * (does not work with variables, simply returns a string of provided id)
         * @export
         * @param {String} id key in object with translation strings
         * @returns {String}
         */
        translate = function translate(id) {
            return messages[language][id]
        }
        // "key" prop is needed to change language dynamically
        return  <IntlProvider locale={language} messages={messages[language]} key={language}>
                    {this.props.children}
                </IntlProvider>
    }
}

export { translate, detectLocale }

export default Translator