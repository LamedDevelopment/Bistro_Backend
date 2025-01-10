const { DateTime, Settings, Info, Zone, Duration } = require("luxon");



// Función para obtener la fecha y hora formateada dependiendo del país
const getDateTimeForCountry = (countryCode) => {
  const timeZone = getTimeZoneForCountryName(countryCode); // Obtenemos la zona horaria del país
  // console.log(`Zona horaria para ${countryCode}:`, timeZone); // Verifica el valor de la zona horaria
  const dateTime = DateTime.local().setZone(timeZone); // Configuramos la zona horaria
  
  return dateTime.toFormat('dd/MM/yyyy, HH:mm:ss'); // Formateamos la fecha
};

// Función para obtener la hora según la zona horaria especificada
const hora = (zonaHoraria) => {
  return DateTime.local().setZone(zonaHoraria).toFormat('HH:mm:ss');
}

// Función para obtener la fecha en formato ISO según la zona horaria proporcionada
const obtenerFechaISO = (zonaHoraria) => {
  // Obtener la fecha y hora local según la zona horaria especificada
  const date = DateTime.local().setZone(zonaHoraria);

  // Obtener la fecha en formato ISO (yyyy-MM-dd) en la zona horaria dada
  const fechaISO = date.toISODate();

  return fechaISO;
};

// Función para generar la marca de tiempo según la zona horaria proporcionada
const generarMarcaDeTiempo = (zonaHoraria) => {
  // Obtener la fecha y hora local según la zona horaria especificada
  const date = DateTime.local().setZone(zonaHoraria);

  // Formatear la fecha y hora en el formato 'dd/MM/yyyy, HH:mm:ss'
  const fechaFormateada = date.toFormat('dd/MM/yyyy, HH:mm:ss');

  // Crear la marca de tiempo utilizando la fecha formateada
  const marcaDeTiempo = DateTime.fromFormat(fechaFormateada, 'dd/MM/yyyy, HH:mm:ss').setZone(zonaHoraria);

  return marcaDeTiempo;
};

// Función para obtener los milisegundos de la fecha en una zona horaria específica
const obtenerMilisegundos = (zonaHoraria) => {
  // Obtener la fecha y hora local según la zona horaria especificada
  const date = DateTime.local().setZone(zonaHoraria);

  // Obtener los milisegundos de la fecha
  return date.toMillis();
};

function formatDateDD_MM_AA_HH_MM_SS_String(fecha, zonaHoraria) {
  // Establecer la zona horaria y formatear la fecha
  return fecha.setZone(zonaHoraria).toFormat('dd/MM/yyyy, HH:mm:ss');
}

// Función para obtener el año de una fecha en formato 'dd/MM/yyyy HH:mm:ss' y zona horaria
function getYearFromDate(dateString, zonaHoraria = 'UTC') {
  const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm:ss').setZone(zonaHoraria);
  return date.year;
}

// Función para obtener el mes de una fecha en formato 'dd/MM/yyyy HH:mm:ss' y zona horaria
function getMonthFromDate(dateString, zonaHoraria = 'UTC') {
  const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm:ss').setZone(zonaHoraria);
  return date.month;
}

// Función para obtener el día de una fecha en formato 'dd/MM/yyyy HH:mm:ss' y zona horaria
function getDayFromDate(dateString, zonaHoraria = 'UTC') {
  const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm:ss').setZone(zonaHoraria);
  return date.day;
}

// Función para obtener el día de la semana de una fecha en formato 'dd/MM/yyyy HH:mm:ss',
// y permite especificar el idioma para la localización
function getDayOfWeekFromDate(dateString, zonaHoraria = 'UTC', idioma) {
  const date = DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm:ss').setZone(zonaHoraria);
  return date.setLocale(idioma).toFormat('EEEE'); // Usa el idioma especificado para mostrar el día de la semana
}

const getTimeZoneForCountryName = (countryCode) => {
  const countryTimeZones = {
    // América del Norte
    "CA": "America/Toronto", // Canadá
    "US": "America/New_York", // Estados Unidos
    "MX": "America/Mexico_City", // México

    // América Central
    "BZ": "America/Belize", // Belice
    "CR": "America/Costa_Rica", // Costa Rica
    "SV": "America/El_Salvador", // El Salvador
    "GT": "America/Guatemala", // Guatemala
    "HN": "America/Tegucigalpa", // Honduras
    "NI": "America/Managua", // Nicaragua
    "PA": "America/Panama", // Panamá

    // América del Sur
    "AR": "America/Argentina/Buenos_Aires", // Argentina
    "BO": "America/La_Paz", // Bolivia
    "BR": "America/Sao_Paulo", // Brasil
    "CL": "America/Santiago", // Chile
    "CO": "America/Bogota", // Colombia
    "EC": "America/Guayaquil", // Ecuador
    "PY": "America/Asuncion", // Paraguay
    "PE": "America/Lima", // Perú
    "UY": "America/Montevideo", // Uruguay
    "VE": "America/Caracas", // Venezuela

    // Caribe
    "CU": "America/Havana", // Cuba
    "DO": "America/Santo_Domingo", // República Dominicana
    "HT": "America/Port-au-Prince", // Haití
    "JM": "America/Jamaica", // Jamaica
    "TT": "America/Port_of_Spain", // Trinidad y Tobago

    // Europa
    "AL": "Europe/Tirane", // Albania
    "AD": "Europe/Andorra", // Andorra
    "AT": "Europe/Vienna", // Austria
    "BY": "Europe/Minsk", // Bielorrusia
    "BE": "Europe/Brussels", // Bélgica
    "BG": "Europe/Sofia", // Bulgaria
    "HR": "Europe/Zagreb", // Croacia
    "CY": "Asia/Nicosia", // Chipre
    "CZ": "Europe/Prague", // República Checa
    "DK": "Europe/Copenhagen", // Dinamarca
    "EE": "Europe/Tallinn", // Estonia
    "FI": "Europe/Helsinki", // Finlandia
    "FR": "Europe/Paris", // Francia
    "DE": "Europe/Berlin", // Alemania
    "GR": "Europe/Athens", // Grecia
    "HU": "Europe/Budapest", // Hungría
    "IS": "Atlantic/Reykjavik", // Islandia
    "IE": "Europe/Dublin", // Irlanda
    "IT": "Europe/Rome", // Italia
    "LV": "Europe/Riga", // Letonia
    "LI": "Europe/Vaduz", // Liechtenstein
    "LT": "Europe/Vilnius", // Lituania
    "LU": "Europe/Luxembourg", // Luxemburgo
    "MT": "Europe/Malta", // Malta
    "MC": "Europe/Monaco", // Mónaco
    "NL": "Europe/Amsterdam", // Países Bajos
    "NO": "Europe/Oslo", // Noruega
    "PL": "Europe/Warsaw", // Polonia
    "PT": "Europe/Lisbon", // Portugal
    "RO": "Europe/Bucharest", // Rumanía
    "RU": "Europe/Moscow", // Rusia
    "SM": "Europe/San_Marino", // San Marino
    "ES": "Europe/Madrid", // España
    "SE": "Europe/Stockholm", // Suecia
    "CH": "Europe/Zurich", // Suiza
    "TR": "Europe/Istanbul", // Turquía
    "UA": "Europe/Kiev", // Ucrania
    "GB": "Europe/London", // Reino Unido

    // Medio Oriente
    "AE": "Asia/Dubai", // Emiratos Árabes Unidos
    "AM": "Asia/Yerevan", // Armenia
    "AZ": "Asia/Baku", // Azerbaiyán
    "BH": "Asia/Bahrain", // Baréin
    "GE": "Asia/Tbilisi", // Georgia
    "IL": "Asia/Jerusalem", // Israel
    "IQ": "Asia/Baghdad", // Irak
    "IR": "Asia/Tehran", // Irán
    "JO": "Asia/Amman", // Jordania
    "KW": "Asia/Kuwait", // Kuwait
    "LB": "Asia/Beirut", // Líbano
    "OM": "Asia/Muscat", // Omán
    "QA": "Asia/Qatar", // Catar
    "SA": "Asia/Riyadh", // Arabia Saudita
    "SY": "Asia/Damascus", // Siria
    "YE": "Asia/Aden", // Yemen
  };

  return countryTimeZones[countryCode] || "UTC"; // Retorna UTC si el código no se encuentra
};




module.exports = {
  getDateTimeForCountry,
  hora,
  obtenerFechaISO,
  generarMarcaDeTiempo,
  obtenerMilisegundos,
  formatDateDD_MM_AA_HH_MM_SS_String,
  getYearFromDate,
  getMonthFromDate,
  getDayFromDate,
  getDayOfWeekFromDate,
  getTimeZoneForCountryName,
};