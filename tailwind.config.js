/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
   
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#B88E2F',
        'primary-grey' : '#333333',
        'primary-grey-light' : '#666666',
         'primary-grey-light-pro' : '#9F9F9F'
       
      }
    },
  },
  plugins: [],
}

