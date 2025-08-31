// netlify/functions/waqi-proxy.js
exports.handler = async function(event, context) {
  const API_KEY = process.env.WAQI_API_KEY; // Se leerá desde las variables de entorno de Netlify
  if (!API_KEY) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'API key no configurada en Netlify' })
    };
  }

  // Permitimos que el cliente envíe latlng como query string, o usamos un valor por defecto
  const latlng = (event.queryStringParameters && event.queryStringParameters.latlng) || '-90,-180,90,180';
  const url = `https://api.waqi.info/map/bounds/?token=${API_KEY}&latlng=${encodeURIComponent(latlng)}`;

  try {
    const res = await fetch(url);
    const json = await res.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // opcional; útil si pruebas desde otro origen
      },
      body: JSON.stringify(json)
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message })
    };
  }
};
