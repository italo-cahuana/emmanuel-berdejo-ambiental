document.addEventListener('DOMContentLoaded', function() {
  // 1. Inicializar mapa (centrado en una ubicación por defecto, ej: Bogotá)
  const mapa = L.map('mapa-aire').setView([4.5709, -74.2973], 3); // Coordenadas, Zoom del mapa

  // 2. Añadir capa base (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(mapa);

   // 3. Cargar datos de WAQI mediante la función Netlify (proxy)
  const proxyUrl = '/.netlify/functions/waqi-proxy?latlng=-90,-180,90,180';

  fetch(proxyUrl)
    .then(response => response.json())
    .then(data => {
      if (!data || !data.data) {
        throw new Error('Respuesta inválida desde el proxy');
      }
      data.data.forEach(estacion => {
        const aqi = estacion.aqi;
        let color, icono;

        if (aqi <= 50) { color = '#4CAF50'; icono = 'bi-emoji-smile'; } 
        else if (aqi <= 100) { color = '#FFC107'; icono = 'bi-emoji-neutral'; }
        else if (aqi <= 150) { color = '#FF5722'; icono = 'bi-emoji-frown'; }
        else { color = '#795548'; icono = 'bi-emoji-dizzy'; }

        L.circleMarker([estacion.lat, estacion.lon], {
          radius: 8,
          fillColor: color,
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mapa)
          .bindPopup(`
            <b>${estacion.station.name}</b><br>
            <i class="bi ${icono}"></i> AQI: ${aqi}<br>
            ${estacion.station.time}
          `);
      });
    })
    .catch(error => {
      console.error("Error al cargar datos:", error);
      document.getElementById('mapa-aire').innerHTML = `
        <div class="alert alert-danger">
          No se pudieron cargar los datos. Intenta recargar la página.
        </div>
      `;
    });



// Aparcen los elementos al hacer Scroll
// Se llama la funcion una vez se haya cargado el DOM
document.addEventListener('DOMContentLoaded', () => aparicionScroll());

function aparicionScroll () { // Se ejecuta la funcion una vez carguen los elementos
    const fadeElements = document.querySelectorAll('.fade-scroll');
    // Selecciona todos los elementos que tengan la etiqueta 

    const observer = new IntersectionObserver((entries) => {
        // se crea un observador, una nueva funcion de js que detecta si un elemento es visible en la pantalla
      entries.forEach(entry => {
        // Por cada elemento (entry) que está siendo observado:
        // Verifica si está intersectando, o sea si está entrando en la vista del usuario.
        if (entry.isIntersecting) { // Si sí lo está (entry.isIntersecting === true), entonces:
          entry.target.classList.add('show');
          // Le agrega la clase .show, que es la que define la animación en CSS
        }
      });
    }, {
      threshold: 0.15 // Paramentro de config. del isIntersecting (cuando el 50% del elemento esté visible, se considera que ya entro en la pantalla)
    });

    fadeElements.forEach(el => observer.observe(el));
    // Y se le dice al observer que empiece a observar cada uno de los elementos con la clase .fade-scroll.
  };
  




  

  // Puden utlizar esta opcion pero para mi es mas legible y mantenible como esta arriba cambiando el principio de la funcion

//   // Se asegura de que el se haya cargdo los elementos en DOM antes de ejecutar la funcion
//   document.addEventListener("DOMContentLoaded", function () { // Se ejecuta la funcion una vez carguen los elementos
//     const fadeElements = document.querySelectorAll(".fade-scroll");
//     // Selecciona todos los elementos que tengan la etiqueta 

//     const observer = new IntersectionObserver((entries) => {
//         // se crea un observador, una nueva funcion de js que detecta si un elemento es visible en la pantalla
//       entries.forEach(entry => {
//         // Por cada elemento (entry) que está siendo observado:
//         // Verifica si está intersectando, o sea si está entrando en la vista del usuario.
//         if (entry.isIntersecting) { // Si sí lo está (entry.isIntersecting === true), entonces:
//           entry.target.classList.add("show");
//           // Le agrega la clase .show, que es la que define la animación en CSS
//         }
//       });
//     }, {
//       threshold: 0.5 // Paramentro de config. del isIntersecting (cuando el 50% del elemento esté visible, se considera que ya entro en la pantalla)
//     });

//     fadeElements.forEach(el => observer.observe(el));
//     // Y se le dice al observer que empiece a observar cada uno de los elementos con la clase .fade-scroll.

//   });
