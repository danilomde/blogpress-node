const express = require("express");
const router = express.Router();
const Article = require("./Article");
const Category = require("../categories/Category");

const slugify = require('slugify');

router.get("/admin/articles", (request, response) => {
    
    Article.findAll({
        include: [{model: Category}]
    }).then( articles => {
        
        response.render('admin/articles/index', {articles: articles});
    });
});



router.get("/admin/articles/new", (request, response) => {
    Category.findAll().then( categories => {
        response.render('admin/articles/new', {categories: categories});
    });
    
});



router.get("/admin/articles/edit/:id", (request, response) => {
    
    var id = request.params.id;

    if( isNaN(id) ){
        response.redirect("/admin/articles");
    }

    Article.findByPk(id).then( article => {                
        
        if ( article != undefined ) {

            Category.findAll().then( categories => {
                response.render("admin/articles/edit", {
                    article: article,
                    categories: categories
                });
            });
               

        }else{
            response.redirect("/admin/articles");
        }
    })
    .catch( (erro) => {
        console.log(erro);
    });

});

router.post('/articles/save', (request, response) => {
    var title = request.body.title;
    var body = request.body.body;
    var categoryId = request.body.categoryId;
    
    if(title != undefined){
        Article.create({  
            title: title ,
            slug: slugify(title, {
                lower: true,  
            }),
            body: body,
            categoryId: categoryId

        }).then( () => {
            response.redirect("/admin/articles");
        });
    }else{
        response.redirect('/admin/articles/new');
    }
});

router.post('/articles/update', (request, response) => {
    var id = request.body.id;
    var title = request.body.title;
    var body = request.body.body;
    var categoryId = request.body.categoryId;
    
    if(title != undefined){
        Article.update({  
            title: title ,
            body: body,
            slug: slugify(title, {
                lower: true,  
            }),
            categoryId: categoryId
        },
        {
            where: {
                id: id
            }
        }).then( () => {
            response.redirect("/admin/articles");
        }).catch( (erro) => {
            console.log(erro);
        });
    }else{
        response.redirect('/admin/articles/new');
    }
});


router.post('/articles/delete', (request, response) => {
    var id = request.body.id;
    
    if( id != undefined ){
        
        if( !isNaN(id) ){
            Article.destroy({
                where: {
                    id: id
                }  
            }).then( () => {
                response.redirect("/admin/articles");
            })
            .catch( (erro) => {
                console.log(erro);
            });

        }else{
            response.redirect("/admin/articles");
        }
        
    }else{
        response.redirect('/admin/articles');
    }
});

router.get("/articles/page/:num", (request, response) => {
    var page = request.params.num;
    var offset = 0;
    var paginate = 2;
    

    if( isNaN(page) || page == 1 ){
        offset = 0
    }else{
        offset = (parseInt(page) * paginate) - paginate
    }

    Article.findAndCountAll({
        limit: paginate,
        offset: offset,
    }).then( articles => {

        var next;
        if(offset + paginate >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next: next,
            articles: articles
        }

        Category.findAll().then( categories => {

            response.render('admin/articles/page', {result: result, categories: categories});
            
        })
        
    });

});

module.exports = router;