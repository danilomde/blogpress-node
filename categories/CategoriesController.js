const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require('slugify');

router.get("/admin/categories", (request, response) => {
    
    Category.findAll().then( categories => {
        
        response.render('admin/categories/index', {categories: categories});
    });
});



router.get("/admin/categories/new", (request, response) => {
    response.render('admin/categories/new');
});



router.get("/admin/categories/edit/:id", (request, response) => {
    
    var id = request.params.id;

    if( isNaN(id) ){
        response.redirect("/admin/categories");
    }

    Category.findByPk(id).then( category => {                
        
        if ( category != undefined ) {
                response.render("admin/categories/edit", {
                    category: category
                });

        }else{
            response.redirect("/admin/categories");
        }
    })
    .catch( (erro) => {
        console.log(erro);
    });

});

router.post('/categories/save', (request, response) => {
    var title = request.body.title;
    
    if(title != undefined){
        Category.create({  
            title: title ,
            slug: slugify(title, {
                lower: true,  
            })
        }).then( () => {
            response.redirect("/admin/categories");
        });
    }else{
        response.redirect('/admin/categories/new');
    }
});

router.post('/categories/update', (request, response) => {
    var id = request.body.id;
    var title = request.body.title;
    
    if(title != undefined){
        Category.update({  
            title: title ,
            slug: slugify(title, {
                lower: true,  
            })
        },
        {
            where: {
                id: id
            }
        }).then( () => {
            response.redirect("/admin/categories");
        });
    }else{
        response.redirect('/admin/categories/new');
    }
});


router.post('/categories/delete', (request, response) => {
    var id = request.body.id;
    
    if( id != undefined ){
        
        if( !isNaN(id) ){
            Category.destroy({
                where: {
                    id: id
                }  
            }).then( () => {
                response.redirect("/admin/categories");
            })
            .catch( (erro) => {
                console.log(erro);
            });

        }else{
            response.redirect("/admin/categories");
        }
        
    }else{
        response.redirect('/admin/categories/new');
    }
});

module.exports = router;