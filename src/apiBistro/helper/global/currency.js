

const getCurrencyForCountry = (countryCode) => {
    const countryCurrencies = {
      // América
      "AR": "ARS",  // Argentina - Peso argentino
      "BO": "BOB",  // Bolivia - Boliviano
      "BR": "BRL",  // Brasil - Real brasileño
      "CA": "CAD",  // Canadá - Dólar canadiense
      "CL": "CLP",  // Chile - Peso chileno
      "CO": "COP",  // Colombia - Peso colombiano
      "CR": "CRC",  // Costa Rica - Colón costarricense
      "CU": "CUP",  // Cuba - Peso cubano
      "DO": "DOP",  // República Dominicana - Peso dominicano
      "EC": "USD",  // Ecuador - Dólar estadounidense
      "GT": "GTQ",  // Guatemala - Quetzal
      "HN": "HNL",  // Honduras - Lempira
      "MX": "MXN",  // México - Peso mexicano
      "NI": "NIO",  // Nicaragua - Córdoba
      "PA": "USD",  // Panamá - Dólar estadounidense
      "PY": "PYG",  // Paraguay - Guaraní
      "PE": "PEN",  // Perú - Sol
      "SR": "SRD",  // Surinam - Dólar surinamés
      "UY": "UYU",  // Uruguay - Peso uruguayo
      "VE": "VES",  // Venezuela - Bolívar soberano
      "US": "USD",  // Estados Unidos - Dólar estadounidense
      // Europa
      "AL": "ALL",  // Albania - Lek
      "AT": "EUR",  // Austria - Euro
      "BE": "EUR",  // Bélgica - Euro
      "BG": "BGN",  // Bulgaria - Lev búlgaro
      "CH": "CHF",  // Suiza - Franco suizo
      "CY": "EUR",  // Chipre - Euro
      "CZ": "CZK",  // República Checa - Corona checa
      "DE": "EUR",  // Alemania - Euro
      "DK": "DKK",  // Dinamarca - Corona danesa
      "EE": "EUR",  // Estonia - Euro
      "ES": "EUR",  // España - Euro
      "FI": "EUR",  // Finlandia - Euro
      "FR": "EUR",  // Francia - Euro
      "GR": "EUR",  // Grecia - Euro
      "HR": "EUR",  // Croacia - Euro
      "HU": "HUF",  // Hungría - Forint
      "IE": "EUR",  // Irlanda - Euro
      "IT": "EUR",  // Italia - Euro
      "LT": "EUR",  // Lituania - Euro
      "LU": "EUR",  // Luxemburgo - Euro
      "LV": "EUR",  // Letonia - Euro
      "MC": "EUR",  // Mónaco - Euro
      "NL": "EUR",  // Países Bajos - Euro
      "NO": "NOK",  // Noruega - Corona noruega
      "PL": "PLN",  // Polonia - Zloty
      "PT": "EUR",  // Portugal - Euro
      "RO": "RON",  // Rumania - Leu rumano
      "RU": "RUB",  // Rusia - Rublo ruso
      "SE": "SEK",  // Suecia - Corona sueca
      "SK": "EUR",  // Eslovaquia - Euro
      "SI": "EUR",  // Eslovenia - Euro
      "UA": "UAH",  // Ucrania - Grivna
      "GB": "GBP",  // Reino Unido - Libra esterlina
      // Medio Oriente
      "AE": "AED",  // Emiratos Árabes Unidos - Dirham
      "BH": "BHD",  // Bahréin - Dinar bareiní
      "IL": "ILS",  // Israel - Nuevo shekel
      "IQ": "IQD",  // Irak - Dinar iraquí
      "IR": "IRR",  // Irán - Rial iraní
      "JO": "JOD",  // Jordania - Dinar jordano
      "KW": "KWD",  // Kuwait - Dinar kuwaití
      "LB": "LBP",  // Líbano - Libra libanesa
      "OM": "OMR",  // Omán - Rial omaní
      "QA": "QAR",  // Catar - Riyal catarí
      "SA": "SAR",  // Arabia Saudita - Riyal saudí
      "SY": "SYP",  // Siria - Libra siria
      "TR": "TRY",  // Turquía - Lira turca
      "YE": "YER",  // Yemen - Rial yemení
      // Asia
      "AF": "AFN",  // Afganistán - Afghani
      "BD": "BDT",  // Bangladesh - Taka
      "BT": "BTN",  // Bután - Ngultrum
      "CN": "CNY",  // China - Yuan renminbi
      "IN": "INR",  // India - Rupia india
      "ID": "IDR",  // Indonesia - Rupia indonesia
      "JP": "JPY",  // Japón - Yen
      "KH": "KHR",  // Camboya - Riel
      "KR": "KRW",  // Corea del Sur - Won
      "LA": "LAK",  // Laos - Kip
      "MY": "MYR",  // Malasia - Ringgit
      "MN": "MNT",  // Mongolia - Tugrik
      "NP": "NPR",  // Nepal - Rupia nepalí
      "PH": "PHP",  // Filipinas - Peso filipino
      "PK": "PKR",  // Pakistán - Rupia pakistaní
      "SG": "SGD",  // Singapur - Dólar de Singapur
      "TH": "THB",  // Tailandia - Baht
      "TW": "TWD",  // Taiwán - Nuevo dólar taiwanés
      "VN": "VND",  // Vietnam - Dong
    }
}

module.exports = { 
    getCurrencyForCountry 
}