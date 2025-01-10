const getDialingCodeForCountry = (countryCode) => {
  const countryDialingCodes = {
    // América
    "AR": "54",   // Argentina
    "BO": "591",  // Bolivia
    "BR": "55",   // Brasil
    "CA": "1",    // Canadá
    "CL": "56",   // Chile
    "CO": "57",   // Colombia
    "CR": "506",  // Costa Rica
    "CU": "53",   // Cuba
    "DO": "1",    // República Dominicana
    "EC": "593",  // Ecuador
    "GT": "502",  // Guatemala
    "HN": "504",  // Honduras
    "MX": "52",   // México
    "NI": "505",  // Nicaragua
    "PA": "507",  // Panamá
    "PY": "595",  // Paraguay
    "PE": "51",   // Perú
    "SR": "597",  // Surinam
    "UY": "598",  // Uruguay
    "VE": "58",   // Venezuela
    "US": "1",    // Estados Unidos

    // Europa
    "AL": "355",  // Albania
    "AT": "43",   // Austria
    "BE": "32",   // Bélgica
    "BG": "359",  // Bulgaria
    "CH": "41",   // Suiza
    "CY": "357",  // Chipre
    "CZ": "420",  // República Checa
    "DE": "49",   // Alemania
    "DK": "45",   // Dinamarca
    "EE": "372",  // Estonia
    "ES": "34",   // España
    "FI": "358",  // Finlandia
    "FR": "33",   // Francia
    "GR": "30",   // Grecia
    "HR": "385",  // Croacia
    "HU": "36",   // Hungría
    "IE": "353",  // Irlanda
    "IT": "39",   // Italia
    "LT": "370",  // Lituania
    "LU": "352",  // Luxemburgo
    "LV": "371",  // Letonia
    "NL": "31",   // Países Bajos
    "NO": "47",   // Noruega
    "PL": "48",   // Polonia
    "PT": "351",  // Portugal
    "RO": "40",   // Rumania
    "RU": "7",    // Rusia
    "SE": "46",   // Suecia
    "SK": "421",  // Eslovaquia
    "SI": "386",  // Eslovenia
    "UA": "380",  // Ucrania
    "GB": "44",   // Reino Unido

    // Medio Oriente
    "AE": "971",  // Emiratos Árabes Unidos
    "BH": "973",  // Bahréin
    "IL": "972",  // Israel
    "IQ": "964",  // Irak
    "IR": "98",   // Irán
    "JO": "962",  // Jordania
    "KW": "965",  // Kuwait
    "LB": "961",  // Líbano
    "OM": "968",  // Omán
    "QA": "974",  // Catar
    "SA": "966",  // Arabia Saudita
    "SY": "963",  // Siria
    "TR": "90",   // Turquía
    "YE": "967",  // Yemen

    // Asia
    "AF": "93",   // Afganistán
    "BD": "880",  // Bangladesh
    "BT": "975",  // Bután
    "CN": "86",   // China
    "IN": "91",   // India
    "ID": "62",   // Indonesia
    "JP": "81",   // Japón
    "KH": "855",  // Camboya
    "KR": "82",   // Corea del Sur
    "LA": "856",  // Laos
    "MY": "60",   // Malasia
    "MN": "976",  // Mongolia
    "NP": "977",  // Nepal
    "PH": "63",   // Filipinas
    "PK": "92",   // Pakistán
    "SG": "65",   // Singapur
    "TH": "66",   // Tailandia
    "TW": "886",  // Taiwán
    "VN": "84",   // Vietnam
  };

  return countryDialingCodes[countryCode] || "N/A";  // Retorna N/A si no se encuentra el país
};

module.exports = { 
  getDialingCodeForCountry 
}
