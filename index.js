const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');



const categoriasController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticleController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");



app.set('view engine', 'ejs');
app.use( bodyParser.urlencoded({extended: false}) );
app.use( bodyParser.json() );
app.use(express.static('public'));


//Database
connection.authenticate()
.then(() =>{
    console.log(" 🎁 Conexão com DB Ok!"); 
})
.catch( (error) => {
    console.log(error)
})

app.use('/',categoriasController);
app.use('/',articlesController);


app.get('/', (request, response) => {
    Article.findAll({
        order: [
            ['id','DESC']
        ]
    }).then( articles => {

        Category.findAll().then( categories => {

            response.render('index', {articles: articles, categories: categories});

        })

    });    
})


app.get('/:slug', (request, response) => {
    var slug = request.params.slug
    
    Article.findOne({
        where: {
            slug: slug
        }
    }).then( article => {
        if (article != undefined){
            Category.findAll().then( categories => {

                response.render('index', {article: article, categories: categories});
                
            })
            
        }else{
            response.redirect('/');
        }
    });    
})


app.get('/category/:slug', (request, response) => {
    var slug = request.params.slug
    
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then( category => {
        if (category != undefined){
             Category.findAll().then( categories => {

                response.render('index', {articles: category.articles, categories: categories});
                
            })
            
        }else{
            response.redirect('/');
        }
    })
    .catch( (error) => {
        response.redirect('/');
    });    


})



app.listen(3000, () => {
    console.log(" 🚀 Servidor iniciado")
})