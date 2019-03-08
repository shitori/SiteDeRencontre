let connection = require('../bin/bdd')
let moment = require('../bin/moment');

class Model {
    static index(cb) {
        connection.query('select * from profil', (err, row) => {
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
                                cb(row, rowP, rowL, rowLL, dejaLike)
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
                //a mettre dans modifié
                connection.query('select * from profil where mail=? and password=?',
                    [dataUser.inputEmail, dataUser.Password], (err, row) => {
                        if (err) throw err
                        console.log(row)
                        for (var i = 0; i < row.length; i++) {
                            var id_user = row[i]["id"]
                        }
                        console.log(id_user)
                        let sql_query
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
                                cb(id_user)
                            })
                        } else {
                            cb(id_user)
                        }

                    })
            })
    }
}

module.exports = Model
