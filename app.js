require('dotenv').config()

const path = require('path')
const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const prismic = require('@prismicio/client')
const prismicDOM = require('prismic-dom')

const initApi = req => {
  return prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = doc => {

  if (doc.type === 'content') {
    return '/content'
  }

  return '/'
}

app.use(express.static(path.join(__dirname, 'public')))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')


app.use((req, res, next) => {

  res.locals.Link = handleLinkResolver
  res.locals.prismicDOM = prismicDOM

  next()
})

const handleRequest = async api => {

  const meta = await api.getSingle('meta')
  const home = await api.getSingle('home')
  const navigation = await api.getSingle('navigation')
  const preloader = await api.getSingle('preloader')
  const footer = await api.getSingle('footer')


  return {
    meta,
    home,
    navigation,
    preloader,
    footer
  }
}


app.get('/', async (req, res) => {
  const api = await initApi(req)
  const defaults = await handleRequest(api)

  res.render('index', {
    ...defaults
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})