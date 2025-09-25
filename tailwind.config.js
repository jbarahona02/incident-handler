/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        'incidente-pendiente': '#fef3c7',
        'incidente-asignado': '#dbeafe', 
        'incidente-revision': '#fce7f3',
        'incidente-reparacion': '#fef7cd',
        'incidente-reparado': '#dcfce7',
        'incidente-finalizado': '#f0fdf4',
      }
    },
  },
  plugins: [],
}
