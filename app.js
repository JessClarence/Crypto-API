require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');



const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));



mongoose.connect('mongodb://localhost:27017/cryptoDB');

const cryptoSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: Number
});


const Crypto = mongoose.model('Crypto', cryptoSchema);


app.route('/crypto')
    .get((req,res)=> {

        Crypto.find((err, foundCrypto)=> {
            if(!err){
                res.send(foundCrypto);
            }else{
                res.send(err);
            }
        })
    })
    .post((req,res)=> {

        const newCrypto = Crypto({
            title: req.body.title,
            content: req.body.content,
            date: req.body.date
        })

        newCrypto.save( (err)=> {
            if(!err){
                res.send('insert Successfully')
            }else{
                res.send(err);
            }
        })
    })
    .delete((req,res)=> {

        Crypto.deleteMany((err)=> {
            if(!err){
                res.send('delete successfully')
            }else{
                res.send(err)
            }
        })
    });

app.route('/crypto/:titleCrypto')
    .get((req,res)=> {
        Crypto.findOne({title: req.params.titleCrypto}, (err, foundCrypto)=> {
            if(foundCrypto){
                res.send(foundCrypto);
            }else{
                res.send(err);
            }
        })
    })
    .put((req,res)=> {
        Crypto.replaceOne(
            {title: req.params.titleCrypto},
            req.body,
            (err)=> {
                if(!err){
                    res.send('updated successfully')
                }else{
                    res.send(err);
                }
            }
        )
    })
    .patch((req,res)=> {
        Crypto.updateOne(
            {title: req.params.titleCrypto},
            req.body,
            (err)=> {
                if(!err){
                    res.send('updated successfully')
                }else{
                    res.send(err);
                }
            }
        )
    })
    .delete((req,res)=> {
        Crypto.deleteOne(
            {title: req.params.titleCrypto},
            (err)=> {
                if(!err){
                    res.send('delete successfully')
                }else{
                    res.send(err);
                }
            }
        )
    });



app.get('/', (req,res)=> {
    res.send('hello world')
})


app.listen(port , ()=> {
    console.log('connected to the ' + port + ' port server');
})