const express=require('express')
const exphbs=require('express-handlebars')
const mongoose=require('mongoose')
const methodoverr=require('method-override')
const session=require('express-session');
const flash=require('connect-flash')
const app=express()
const bodyParser=require('body-parser')
const ideaRouter=require('./routes/idea')
const userRouter=require('./routes/user');
const passport=require('passport');
const helmet=require('helmet')
const compression=require('compression');

mongoose.Promise=global.Promise

const keys=require('./config/keys');


mongoose.connect(keys.mongo_uri)
.then(()=>console.log('mongo connected'))
.catch(err=>console.log(err))


require('./config/passport')(passport)

app.engine('handlebars',exphbs({defaultLayout:'main'}))

app.set('view engine','handlebars')

app.use(helmet())
app.use(compression())

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(methodoverr('_method'))

app.use(session({
    secret:'secret',
    saveUninitialized:true,
    resave:true, 
}));

app.use(passport.initialize())
app.use(passport.session())

app.use(flash());



app.use((req,res,next)=>{
    console.log(3)
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    res.locals.user=req.user||null
    next();
})


app.use('/ideas',ideaRouter)
app.use('/users',userRouter)

app.get('/',(req,res)=>{
    const title='hello'
    res.render('index',{
        title:title
    })})

app.get('/about',(req,res)=>{
    res.render('about')
})

app.use((req,res,next)=>{
    res.redirect('errors')
})


app.listen(process.env.PORT||5000,()=>{
    console.log(`it is started on  `)
})

