const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'b7a557db95a568c485f8906afae3d239144c4fc6452c7ce6837fd55ae803a0defadb48e96ceb0882d40b34afe6d8a216909fda98300da479a4734be3147d63b6f5b0ccfad2071ebc354e30e029588157');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({});
    }
}