'use strict'

const fanficController = require('../controllers');

module.exports = (app) => {
    
    app.get('/', (req, res) => {
        res.json({'message': 'ok'});
    });

    app.route('/tags/:tagName/:pageNumber')
        .get(fanficController.getAllFanficsOnPage);

    app.route('/tags/:tagName/:pageNumber/:indexNumber')
        .get(fanficController.getSpecificFanficOnPage);

    app.use((req, res) => {
        res.status(404)
            .send({url: `url for tag ${req.tagName} on page ${req.pageNumber} could not be found.`});
    });
}