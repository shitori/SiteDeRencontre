let connection = require('../bin/bdd')
let moment = require('../bin/moment');

function isValidEmailAddress(emailAddress) {
    let pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

function dataError(data) {
    let actualDate = new Date()
    if (!isValidEmailAddress(data.inputEmail)
        || data.inputFirstName==""
        || data.inputLastName==""
        || data.inputPseudo==""
        || data.inputBirth==""
        || data.inputPassword!=data.inputConfirmPassword
        || data.inputPassword.length <=3
        || data.inputEmail.length >= 50
        || data.inputFirstName.length >= 50
        || data.inputPseudo.length >= 50
        || data.inputPassword.length >= 50
        || data.inputPhone.length > 10
        || data.inputVille.length >= 50
        || data.inputBlog.length >= 250
        || data.inputSexe.length >= 11
        || data.inputSituation.length >= 50) {
        return true;
    }else {
        let birth = new Date(data.inputBirth);
        console.log(actualDate.getFullYear()-birth.getFullYear());
        if (actualDate.getFullYear()-birth.getFullYear()>16){
            return false;
        }else{
            return true;
        }
    }
}


function dataError2(data) {
    let actualDate = new Date()
    if (!isValidEmailAddress(data.inputEmail)
        || data.inputFirstName==""
        || data.inputLastName==""
        || data.inputPseudo==""
        || data.inputBirth==""
        || data.inputEmail.length >= 50
        || data.inputFirstName.length >= 50
        || data.inputPseudo.length >= 50
        || data.inputPhone.length > 10
        || data.inputVille.length >= 50
        || data.inputBlog.length >= 250
        || data.inputSexe.length >= 11
        || data.inputSituation.length >= 50) {
        return true;
    }else {
        let birth = new Date(data.inputBirth);
        console.log(actualDate.getFullYear()-birth.getFullYear());
        if (actualDate.getFullYear()-birth.getFullYear()>16){
            return false;
        }else{
            return true;
        }
    }
}

class Model {
    static index(cb) {
        connection.query('select * from profil order by rand() limit 6', (err, row) => {
            if (err) throw err
            connection.query('select * from photo where name like "%-1%"', (err, rowI) => {
                if (err) throw err
                for (let i = 0; i < row.length; i++) {
                    row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                    for (let j = 0; j < rowI.length; j++) {
                        if (row[i]['id'] == rowI[j]['id_user']) {
                            row[i]['image'] = rowI[j]['name']
                        }
                    }
                }
                cb(row)
            })
        })
    }

    static search(ch, cb) {
        connection.query('select * from profil where nom=? or prenom=? or pseudo=?', [ch, ch, ch], (err, row) => {
            if (err) throw err
            connection.query('select * from photo where name like "%-1%"', (err, rowI) => {
                if (err) throw err
                for (let i = 0; i < row.length; i++) {
                    row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                    for (let j = 0; j < rowI.length; j++) {
                        if (row[i]['id'] == rowI[j]['id_user']) {
                            row[i]['image'] = rowI[j]['name']
                        }
                    }
                }
                cb(row)
            })
        })
    }

    static signin(mail, password, cb) {
        connection.query('select * from profil where mail=?', [mail], (err, row) => {
            if (err) throw err
            if (row.length == 0) {
                cb(0)
            } else if (row[0]['password'] == password) {
                cb(row[0]['id'])
            } else {
                cb(-1)
            }
        })
    }

    static friends(id, cb) {
        connection.query('select * from profil where id in (select destinataire from ami where envoyeur =? and destinataire in (select envoyeur from ami where destinataire =?));', [id, id], (err, row) => {
            if (err) throw err
            connection.query('select * from photo where name like "%-1%"', (err, rowI) => {
                if (err) throw err
                for (let i = 0; i < row.length; i++) {
                    row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                    for (let j = 0; j < rowI.length; j++) {
                        if (row[i]['id'] == rowI[j]['id_user']) {
                            row[i]['image'] = rowI[j]['name']
                        }
                    }
                }
                cb(row)
            })
        })
    }

    static profil(id, myid, cb) {
        connection.query('select * from profil where id = ?', [id], (err, row) => {
            if (err) throw err
            for (let i = 0; i < row.length; i++) {
                row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
            }
            connection.query('select * from photo where id_user = ?', [id], (err, rowP) => {
                if (err) throw err
                connection.query('select * from profil where id in (select destinataire from ami where envoyeur=?)', [id], (err, rowL) => {
                    if (err) throw err
                    connection.query('select * from profil where id in (select envoyeur from ami where destinataire=?)', [id], (err, rowLL) => {
                        if (err) throw err
                        connection.query('select * from photo where name like "%-1%"', (err, rowI) => {
                            if (err) throw err
                            for (let i = 0; i < rowL.length; i++) {
                                rowL[i]['date_naissance'] = (moment(rowL[i]['date_naissance']).fromNow()).replace("il y a ", "")
                                for (let j = 0; j < rowI.length; j++) {
                                    if (rowL[i]['id'] == rowI[j]['id_user']) {
                                        rowL[i]['image'] = rowI[j]['name']
                                    }
                                }
                            }
                            for (let i = 0; i < rowLL.length; i++) {
                                rowLL[i]['date_naissance'] = (moment(rowLL[i]['date_naissance']).fromNow()).replace("il y a ", "")
                                for (let j = 0; j < rowI.length; j++) {
                                    if (rowLL[i]['id'] == rowI[j]['id_user']) {
                                        rowLL[i]['image'] = rowI[j]['name']
                                    }
                                }
                            }
                            connection.query('select * from ami where envoyeur = ? and destinataire = ?', [myid, id], (err, rowA) => {
                                if (err) throw err
                                let dejaLike
                                if (rowA.length > 0) {
                                    console.log("amis")
                                    dejaLike = true
                                } else {
                                    console.log("pas amis")
                                    dejaLike = false
                                }
                                connection.query('select * from passionstock where id in (select id_passion from passion where id_user = ?)',[id],(err,rowPA)=>{
                                    if (err) throw err
                                    cb(row, rowP, rowL, rowLL, dejaLike,rowPA)
                                })

                            })
                        })
                    })

                })
            })
        })
    }

    static addImage(id, detail, cb) {
        console.log("id=" + id)
        connection.query('select * from photo where id_user = ?', [id], (err, row) => {
            if (err) throw err
            let numImage = row.length + 1
            let name = id + "-" + numImage + ".png"
            connection.query('insert into photo values (default ,?,?,?)', [id, detail, name], (err, rowB) => {
                if (err) throw err
                console.log("Image ajouté")
                cb(name)
            })
        })
    }

    static allPassion(cb) {
        connection.query('select * from passionstock', (err, row) => {
            if (err) throw err
            cb(row)
        })
    }

    static addUser(dataUser, cb) {
        console.log(dataUser)
        if (dataError(dataUser)){
            cb("Une erreur c'est produit!")
        }
        connection.query('insert into profil (mail, password, pseudo, date_naissance, ville, situation, a_propos, nom, telephone, blog, diplome, prenom, sexe) values (?,?,?,?,?,?,?,?,?,?,?,?,?)',
            [dataUser.inputEmail,
                dataUser.inputPassword,
                dataUser.inputPseudo,
                new Date(dataUser.inputBirth),
                dataUser.inputVille,
                dataUser.inputSituation,
                dataUser.inputDescription,
                dataUser.inputLastName,
                dataUser.inputPhone,
                dataUser.inputBlog,
                dataUser.inputDiplome,
                dataUser.inputFirstName,
                dataUser.inputSexe], (err) => {
                if (err) throw err
                console.log("nouvelle utilisateur")
                connection.query('select id from profil order by id DESC', (err, row) => {
                        if (err) throw err
                        console.log(row)
                        var id_user = row[0]["id"]
                        console.log(id_user)
                        let sql_query=""
                        if (dataUser.inputPassion != undefined) {
                            for (var i = 0; i < dataUser.inputPassion.length; i++) {
                                if (i == 0) {
                                    sql_query = "insert into passion values (default," + connection.escape(id_user)
                                        + "," + connection.escape(dataUser.inputPassion[i]) + ")"
                                } else {
                                    sql_query = sql_query + ",(default," + connection.escape(id_user)
                                        + "," + connection.escape(dataUser.inputPassion[i]) + ")"
                                }
                            }
                            connection.query(sql_query, (err) => {
                                if (err) throw err
                                cb(-2)
                            })
                        } else {
                            cb(-2)
                        }

                    })

            })
    }

    static addLike(ide,idd,cb){
        if (Number.isInteger(parseInt(ide,10)) && Number.isInteger(parseInt(idd,10))){
            connection.query('insert into ami values (default ,?,?)',[ide,idd],(err)=>{
                if (err) throw err
                cb("like enregistré")
            })
        }else {
            cb("probleme d'argument, like annulé")
        }
    }

    static removeLike(ide,idd,cb){
        connection.query('delete from ami where envoyeur=? and destinataire=?',[ide,idd],(err)=>{
            if (err) throw err
            cb("dislike enregistré")
        })
    }

    static randomProfil(id,cb){
        connection.query("select * from profil where id not in (select destinataire from ami where envoyeur = ?) order by rand() limit 1",[id],(err,row)=>{
            if (err) throw err
            connection.query('select * from photo where name like "%-1%"',(err,rowI)=>{
                if (err) throw err
                for (let i = 0; i < row.length; i++) {
                    row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                    for (let j = 0; j < rowI.length; j++) {
                        if (row[i]['id'] == rowI[j]['id_user']) {
                            row[i]['image'] = rowI[j]['name']
                        }
                    }
                }
                cb(row)
            })
        })
    }

    static myTastesProfil(id,cb){
        connection.query("select * from profil where id in (select id_user from passion where id_passion in (select id_passion from passion where id_user = ?)) and id not in (select destinataire from ami where envoyeur = ?) order by rand() limit 1;"
            ,[id,id],(err,row)=>{
                if (err) throw err
                connection.query('select * from photo where name like "%-1%"',(err,rowI)=>{
                    if (err) throw err
                    for (let i = 0; i < row.length; i++) {
                        row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                        for (let j = 0; j < rowI.length; j++) {
                            if (row[i]['id'] == rowI[j]['id_user']) {
                                row[i]['image'] = rowI[j]['name']
                            }
                        }
                    }
                    cb(row)
                })
            })
    }

    static othersTastesProfil(id,cb){
        connection.query("select * from profil where id in (select id_user from passion where id_passion not in (select id_passion from passion where id_user = ?)) and id not in (select destinataire from ami where envoyeur = ?) order by rand() limit 1;"
            ,[id,id],(err,row)=>{
                if (err) throw err
                connection.query('select * from photo where name like "%-1%"',(err,rowI)=>{
                    if (err) throw err
                    for (let i = 0; i < row.length; i++) {
                        row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                        for (let j = 0; j < rowI.length; j++) {
                            if (row[i]['id'] == rowI[j]['id_user']) {
                                row[i]['image'] = rowI[j]['name']
                            }
                        }
                    }
                    cb(row)
                })
            })
    }

    static modifProfil(id,cb){
        connection.query('select * from profil where id = ?',[id],(err,row)=>{
            if (err) throw err
            for (let i = 0; i < row.length; i++) {
                var date=new Date(row[i]['date_naissance'])
                row[i]['date_naissance'] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
            }
            connection.query('select * from passionstock where id in (select id_passion from passion where id_user=?)',[id],(err,rowP)=>{
                if (err) throw err
                connection.query('select * from passionstock where id not in (select id_passion from passion where id_user=?)',[id],(err,rowNP)=>{
                    if (err) throw err
                    cb(row,rowP,rowNP)
                })
            })
        })
    }

    static applyModifProfil(id,dataUser,cb){
        if (dataError2(dataUser)){
            cb("une erreur est intervenue")
        }
        connection.query("update profil set mail=?,pseudo=?,date_naissance=?,ville=?,situation=?,a_propos=?,nom=?,telephone=?,blog=?,diplome=?,prenom=?,sexe=? where id=?",
            [dataUser.inputEmail,
            dataUser.inputPseudo,
            new Date(dataUser.inputBirth),
            dataUser.inputVille,
            dataUser.inputSituation,
            dataUser.inputDescription,
            dataUser.inputLastName,
            dataUser.inputPhone,
            dataUser.inputBlog,
            dataUser.inputDiplome,
            dataUser.inputFirstName,
            dataUser.inputSexe,id],(err,row)=>{
                if (err) throw err
                console.log("info user OK")
                connection.query("delete from passion where id_user=?",[id],(err,rowB)=>{
                    if (err) throw err
                    console.log("passion user REMOVE")
                    let sql_query=""
                    console.log(dataUser.inputPassion)
                    if (dataUser.inputPassion != undefined) {
                        for (var i = 0; i < dataUser.inputPassion.length; i++) {
                            if (i == 0) {
                                sql_query = "insert into passion values (default," + connection.escape(id)
                                    + "," + connection.escape(dataUser.inputPassion[i]) + ")"
                            } else {
                                sql_query = sql_query + ",(default," + connection.escape(id)
                                    + "," + connection.escape(dataUser.inputPassion[i]) + ")"
                            }
                        }
                        connection.query(sql_query, (err) => {
                            if (err) throw err
                            cb("passion user OK")
                        })
                    }else{
                        cb("user aucunes passion")
                    }
                })
            })
    }

    static messages(idMe,idF,cb){
        connection.query("select * from message where (envoyeur = ? and destinataire =? ) or (envoyeur = ? and destinataire =? ) order by send",[idMe,idF,idF,idMe],(err,rowM)=>{
            if (err) throw err
            connection.query('select * from profil where id=? or id=?',[idF,idMe],(err, row) => {
                if (err) throw err
                connection.query('select * from photo where name like "%-1%"', (err, rowI) => {
                    if (err) throw err
                    for (let i = 0; i < row.length; i++) {
                        row[i]['date_naissance'] = (moment(row[i]['date_naissance']).fromNow()).replace("il y a ", "")
                        for (let j = 0; j < rowI.length; j++) {
                            if (row[i]['id'] == rowI[j]['id_user']) {
                                row[i]['image'] = rowI[j]['name']
                            }
                        }
                    }
                    for (let i = 0; i < rowM.length; i++) {
                        rowM[i]["send"]=(moment(rowM[i]["send"])).fromNow()
                    }
                    cb(rowM,row,idMe,idF)
                })
            })
        })
    }

    static addMessage(ide,idd,text,cb){
        if (Number.isInteger(parseInt(ide,10)) && Number.isInteger(parseInt(idd,10))){
            connection.query("insert into message values (default,?,?,?,?)",[ide,idd,new Date(),text],(err)=>{
                if (err) throw err
                cb("new message")
            })
        }else {
            cb("probleme d'argument, like annulé")
        }

    }
}

module.exports = Model
