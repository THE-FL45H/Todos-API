const { Todo } = require("../models");
const { HTTP_NOT_FOUND } = require("../utils/status_codes");

const UserOwnsTodo = async (req, res, next) => {
    const { id: todoId } = req.params;
    const user = req.user;
    const todo = await Todo.findByPk(todoId);
    if(todo === null) {
        return res.status(HTTP_NOT_FOUND).json({
            "details": "Todo does not exist"
        });
    }
    if (todo.userId !== user.id) {
        return res.status(HTTP_UNAUTHORIZED).json({
            "details": "Not authorized to delete todo"
        });
    } else {
        return next();
    }
}

module.exports = {
    UserOwnsTodo,
}