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
  model.profil(req.session.id_user,0,function (profil,mesImages,mesLikes,mesLLike,dejaLike) {
      res.render('myprofil',{ profil: profil,images : mesImages, nbImage :mesImages.length,likes :mesLikes,rlikes :mesLLike,testLog: login(req.session.id_user) });
  })
});

router.get('/profil/:id', function(req, res, next) {
    model.profil(req.params.id,req.session.id_user,function (profil,mesImages,mesLikes,mesLLike,dejaLike) {
        console.log(dejaLike)
        res.render('profil',{ profil: profil,images : mesImages, nbImage :mesImages.length,likes :mesLikes,rlikes :mesLLike,dejaLike:dejaLike,testLog: login(req.session.id_user) });
    })
});

router.post('/profil', function(req, res, next) {
    model.addImage(req.session.id_user,req.body.detailFile,function (name) {
        if (Object.keys(req.files).length == 0) {
            return res.status(400).send('No files were uploaded.');
        }
        let sampleFile = req.files.sampleFile;
        sampleFile.mv('./public/images/user_image/'+name, function(err) {
            if (err)
                return res.status(500).send(err);
            res.redirect("/profil")
        });
    })
});



router.get('/modifier_profile', function(req, res, next) {
  res.render('modifprofil',{ testLog: login(req.session.id_user) });
});

router.post('/modifier_profile', function(req, res, next) {
  res.render('modifprofil',{ testLog: login(req.session.id_user) });
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
    model.addUser(req.body,function (id) {
        console.log(id)
        req.session.id_user=id
        res.redirect("/")
    })
});



router.get('/tchat', function(req, res, next) {
  model.friends(req.session.id_user,function (amis) {
      res.render('match',{ amis : amis,testLog: login(req.session.id_user) });
  })
});

router.get('/tchat/:id', function(req, res, next) {
  res.render('tchat',{ testLog: login(req.session.id_user) });
});

router.post('/tchat/:id', function(req, res, next) {
  res.render('tchat',{ testLog: login(req.session.id_user) });
});



router.get('/search', function(req, res, next) {
  res.render('search',{ testLog: login(req.session.id_user) });
});

router.post('/search', function(req, res, next) {
  res.render('search',{ testLog: login(req.session.id_user) });
});


module.exports = router;
