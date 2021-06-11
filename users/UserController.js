const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require('bcryptjs');
const adminAuth = require("../middlewares/adminAuth");

const slugify = require('slugify');

router.get("/admin/users",adminAuth, (request, response) => {
    
    User.findAll().then( users => {
        
        response.render('admin/users/index', {users: users});
    });
});



router.get("/admin/users/new", (request, response) => {
    response.render('admin/users/new');
});

router.get("/login", (request, response) => {
    response.render('admin/users/login');
});

router.post("/authenticate", (request, response) => {
    
    var email = request.body.email;
    var password = request.body.password;

    User.findOne({where: {email:email}}).then( user => {
      
        if(user != undefined){
            var correct = bcrypt.compareSync(password, user.password);
          
            if(correct){
                request.session.user = {
                    id: user.id,
                    email: user.email
                }

                response.redirect('/admin/articles');  
            }else{
                response.redirect('/login');     
            }
        }else{
            response.redirect('/login');
        }
    })

});

router.get("/logout", adminAuth,(request, response) => {

    request.session.user = undefined;

    response.redirect('/');
});



router.get("/admin/users/edit/:id", adminAuth,(request, response) => {
    
    var id = request.params.id;
    
    if( isNaN(id) ){
        response.redirect("/admin/users");
    }
    
    User.findByPk(id).then( user => {                
        
        if ( user != undefined ) {
            response.render("admin/users/edit", {
                user: user
            });
            
        }else{
            response.redirect("/admin/users");
        }
    })
    .catch( (erro) => {
        console.log(erro);
    });
    
});

router.post('/users/save', (request, response) => {
    var email = request.body.email;
    var password = request.body.password;
    
    User.findOne({where: {email: email}}).then( user => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);
            
            
            User.create({  
                email: email ,
                password: hash
            }).then( () => {
                response.redirect("/admin/users");
            })
            .catch( (erro) => {
                response.redirect("/admin/users/new");
            });
        }else{
            response.redirect("/admin/users/new");
        }
    });
    
    
    
    
    
});

router.post('/users/update',adminAuth, (request, response) => {
    var email = request.body.email;
    var id = request.body.id;
    var password = request.body.password;
    
    User.findOne({where: {email: email}}).then( user => {
        
                       
            if(password != undefined){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
                
                User.update({  
                    email: email ,
                    password: hash
                },
                {
                    where: {
                        id: id
                    }
                }).then( () => {
                    response.redirect("/admin/users");
                })
                .catch( (erro) => {
                    response.redirect("/admin/users/edit/"+id);
                });
                
            }else{
                User.update({  
                    email: email 
                },
                {
                    where: {
                        id: id
                    }
                }).then( () => {
                    response.redirect("/admin/users");
                })
                .catch( (erro) => {
                    response.redirect("/admin/users/edit/"+id);
                });
            }
            
      
    });
});


router.post('/users/delete', adminAuth,(request, response) => {
    var id = request.body.id;
    
    if( id != undefined ){
        
        if( !isNaN(id) ){
            User.destroy({
                where: {
                    id: id
                }  
            }).then( () => {
                response.redirect("/admin/users");
            })
            .catch( (erro) => {
                console.log(erro);
            });
            
        }else{
            response.redirect("/admin/users");
        }
        
    }else{
        response.redirect('/admin/users/new');
    }
});



module.exports = router;