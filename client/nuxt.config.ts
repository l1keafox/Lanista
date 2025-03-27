// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@nuxt/fonts'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    config:{
      theme:{
        extend:{
          fontFamily :{
            mana :['mana','Roboto'],
            sbit :['sbit','Roboto'],
            neo: ["GFS Neohellenic", "sans-serif"],            
          }
        }
      }
    }
  }
})