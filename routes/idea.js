const express = require('express');
const router = express.Router();
const Ideas = require('../models/ideas');
const isAuth = require('../helper/auth');

router.get('/Add', isAuth, (req, res) => {
    res.render('ideas/add')
})

router.get('/edit/:id', isAuth, (req, res) => {
    
    Ideas.findById(req.params.id)
        .then(idea => {
            console.log(req.user._id +"seconds"+ idea.user)
            if (req.user._id.toString() !== idea.user.toString()) {
                return res.redirect('/ideas')
            }else{
            res.render('ideas/edit',
                {
                    title: idea.title,
                    details: idea.details,
                    id: idea._id
            })}
        }).catch(err => console.log(err))

})

router.get('/', isAuth, (req, res) => {
    Ideas.find()
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            })
        }).catch(err => console.log(err))
})



router.post('/', isAuth, (req, res) => {
    let errors = []
    if (!req.body.title) {
        errors.push({ text: 'please enter a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'please enter some details' })
    }
    if (errors.length > 0) {
        res.render('ideas/add', {
            title: req.body.title,
            errors: errors,
            details: req.body.details
        })
    } else {
        const idea = new Ideas({
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        })
        idea.save()
            .then((ideaa) => {
                req.flash('success_msg', "added successfully")
                res.redirect('/ideas')
            }
            ).catch(err => console.log(err))
    }
})

router.delete('/:id', isAuth, (req, res) => {
    Ideas.findById(req.params.id)
        .then(idea => {
            if (req.user._id.toString() !== idea.user.toString()) {
                return res.redirect('/ideas')
        }else{
    Ideas.findByIdAndRemove(req.params.id)
        .then(() => {
            req.flash('success_msg', "deleted successfully")
            res.redirect('/ideas')
        })}
    }).catch(err => console.log(err))
}
)


router.put('/:id', isAuth, (req, res) => {
    Ideas.findById(req.params.id)
        .then(idea => {
          //  console.log(req.user._id +"the second one"+ idea.user)
          if (req.user._id.toString() !== idea.user.toString()) {
            return res.redirect('/ideas')
            }else{
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(() => {
                    req.flash('success_msg', "edited successfully")
                })}       res.redirect('/ideas')
            }).catch(err => console.log(err))
        })

module.exports = router