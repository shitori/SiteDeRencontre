let connection = require('../bin/bdd')
let moment = require('../bin/moment');

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
        connection.query('insert into ami values (default ,?,?)',[ide,idd],(err)=>{
            if (err) throw err
            cb("like enregistré")
        })
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
        connection.query("select id from profil where id in (select id_user from passion where id_passion in (select id_passion from passion where id_user = 7))and id not in (select destinataire from ami where envoyeur = 7) order by rand() limit 1;"
            ,[id],(err,row)=>{
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
        connection.query("select * from profil where id in (select id_user from passion where id_passion not in (select id_passion from passion where id_user = ?)) order by rand() limit 1;"
            ,[id],(err,row)=>{
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
}

module.exports = Model
