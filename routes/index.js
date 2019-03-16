let express = require('express');
let router = express.Router();
let model = require('../models/bddAccess')

function login(l){
    if (l==undefined){
        l=0
        return l
    }
    return l
}

router.get('/', function(req, res, next) {
  model.index(function (profils) {
    res.render('index', { profils : profils,title: 'Express',testLog: login(req.session.id_user) });
  })
});

router.post('/',function (req,res,next) {
  if (req.body.disconnect !=undefined){
    req.session.id_user=0
    res.redirect('/')
  } else{
    model.search(req.body.search,function (profils) {
      res.render('index', { profils : profils,title: 'Express',testLog: login(req.session.id_user) });

    })
  }
});



router.get('/profil', function(req, res, next) {
  model.profil(req.session.id_user,0,function (profil,mesImages,mesLikes,mesLLike,dejaLike,passion) {
      res.render('myprofil',{ profil: profil,images : mesImages, nbImage :mesImages.length,likes :mesLikes,rlikes :mesLLike,passions:passion,testLog: login(req.session.id_user) });
  })
});

router.get('/profil/:id', function(req, res, next) {
    model.profil(req.params.id,req.session.id_user,function (profil,mesImages,mesLikes,mesLLike,dejaLike,passion) {
        console.log(dejaLike)
        res.render('profil',{ id_user:req.params.id,profil: profil,images : mesImages, nbImage :mesImages.length,likes :mesLikes,rlikes :mesLLike,dejaLike:dejaLike,passions:passion,testLog: login(req.session.id_user) });
    })
});

router.post('/profil/:id', function(req, res, next) {
    if (req.body.action=="like") {
        model.addLike(req.session.id_user,req.params.id,function (status) {
            res.redirect('/profil/'+req.params.id)
        })
    }else{
        model.removeLike(req.session.id_user,req.params.id,function (status){
            res.redirect('/profil/'+req.params.id)
        })
    }

});

router.post('/profil', function(req, res, next) {
    model.addImage(req.session.id_user,req.body.detailFile,function (name) {
        if (Object.keys(req.files).length == 0) {
            console.log("aucune ficher dll")
            res.redirect("/profil")
        }
        let sampleFile = req.files.sampleFile;
        sampleFile.mv('./public/images/user_image/'+name, function(err) {
            if (err)
                console.log("impossible d'ajouter le fichier")
            res.redirect("/profil")
        });
    })
});



router.get('/modifier_profile', function(req, res, next) {
    model.modifProfil(req.session.id_user,function (data,passion,notPassion) {
        res.render('modifprofil',{data:data,passion:passion,notPassion:notPassion, testLog: login(req.session.id_user) });
    })

});

router.post('/modifier_profile', function(req, res, next) {
    console.log(req.body)
    model.applyModifProfil(req.session.id_user,req.body,function (status) {
        console.log(status)
        res.redirect("/profil")
    })
});



router.get('/connexion', function(req, res, next) {
    console.log(req.session)
  res.render('signIn',{ testLog: login(req.session.id_user), status: 1 });
});

router.post('/connexion', function(req, res, next) {
  model.signin(req.body.mail,req.body.password,function (result) {
    if (result==-1 || result==0){
      res.render('signIn',{testLog: login(req.session.id_user), status: result});
    } else {
        req.session.id_user=result
        res.redirect('/')
    }
  })
});



router.get('/inscription', function(req, res, next) {
    model.allPassion(function (passions) {
        res.render('signUp',{passions:passions ,testLog: login(req.session.id_user) });
    })

});

router.post('/inscription', function(req, res, next) {
    model.addUser(req.body,function (status) {
        res.render('signIn',{ testLog: login(req.session.id_user), status: status });
    })
});



router.get('/tchat', function(req, res, next) {
  model.friends(req.session.id_user,function (amis) {
      res.render('match',{ amis : amis,testLog: login(req.session.id_user) });
  })
});

router.get('/tchat/:id', function(req, res, next) {
    model.friends(req.session.id_user,function (amis) {
        model.messages(req.session.id_user,req.params.id,function (messages,infos,idMe,idF) {
            console.log(infos)
            res.render('tchat',{ amis : amis,messages:messages,infos:infos,idMe:idMe,idF:idF,testLog: login(req.session.id_user) });
        })
    })
});

router.post('/tchat/:id', function(req, res, next) {
    model.addMessage(req.session.id_user,req.params.id,req.body.message,function (status) {
        console.log(status)
        res.redirect("/tchat/"+req.params.id)
    })
});



router.get('/search/:type_search', function(req, res, next) {
    console.log(req.params.type_search)
    if (req.params.type_search=="random") {
        model.randomProfil(req.session.id_user,function (profil) {
            console.log(profil)
            res.render("search",{type:req.params.type_search,profil:profil,testLog: login(req.session.id_user)})
        })
    }else if (req.params.type_search=="mytastes") {
        model.myTastesProfil(req.session.id_user,function (profil) {
            res.render("search",{type:req.params.type_search,profil:profil,testLog: login(req.session.id_user)})
        })
    }else if (req.params.type_search=="otherstaste") {
        model.othersTastesProfil(req.session.id_user,function (profil) {
            res.render("search",{type:req.params.type_search,profil:profil,testLog: login(req.session.id_user)})
        })
    }else{
        res.redirect("/")
    }
});

router.post('/search/:type_search', function(req, res, next) {
    model.addLike(req.session.id_user,req.body.id_like,function (status) {
        res.redirect('/search/'+req.params.type_search)
    })
});


module.exports = router;
