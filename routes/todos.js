const { ValidatorResponse } = require("../middlewares");
const { VerifyToken } = require("../middlewares/auth");
const { UserOwnsTodo } = require("../middlewares/todos");
const { todoCreateRouteValidators } = require("../middlewares/validators");
const { User, Todo } = require("../models");
const { HTTP_CREATED, HTTP_INTERNAL_SERVER_ERROR } = require("../utils/status_codes");
const router = require("express").Router();

router.use(VerifyToken);

router.get("/", async (req, res) => {
    /**
        @headers {
            access: ""
        } 
    */
    const user = req.user;
    const todos = await req.user.getTodos();
    console.log(todos);
    res.json(todos);
})

router.get("/:id",
    UserOwnsTodo,
    async (req, res) => {
        /**
            @headers {
                access: ""
            }

            @response {
              id: 1,
                title: "", 
                description: "", 
                completed: false, 
                userId: 1, 
                createdAt: "", 
                updatedAt: ""  
            }
        */
        const { id: todoId } = req.params;
        const todo = await Todo.findByPk(todoId);
        res.json(todo);
    })

router.post("/create",
    ...todoCreateRouteValidators,
    ValidatorResponse,
    async (req, res) => {
        /**
            @headers {
                access: ""
            }

            @response {
                id: 1,
                title: "", 
                description: "", 
                completed: false, 
                userId: 1, 
                createdAt: "", 
                updatedAt: ""
            }
        */
        const {
            title,
            description,
            completed,
        } = req.body;
        try {
            const createdTodo = await Todo.create(
                {
                    title, description,
                    completed,
                    userId: req.user.id,
                }
            );
            res.status(HTTP_CREATED).json(createdTodo);
        } catch (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).json({
                details: "An error occurred"
            })
        }

    })

router.put("/:id",
    UserOwnsTodo,
    async (req, res) => {
        /**
            @headers {
                access: ""
            }

            @body {
                [title: ""],
                [description: ""],
                [completed: false]
            }

            @response {
                id: 1,
                title: "", 
                description: "", 
                completed: false, 
                userId: 1, 
                createdAt: "", 
                updatedAt: ""
            }
        */
        const { id: todoId } = req.params;
        const { title, description, completed } = req.body;
        const todo = await Todo.findByPk(todoId);
        todo.title = title || todo.title;
        todo.description = description || todo.description;
        todo.completed = completed || todo.completed;

        res.json(todo);
    })

router.delete("/:id",
    UserOwnsTodo,
    async (req, res) => {
        /**
            @headers {
                access: ""
            }

            @response {
                details: "Successfully deleted"
            }
        */
        const { id: todoId } = req.params;
        const todo = await Todo.findByPk(todoId);
        await todo.destroy();
        res.json({
            details: "Successfully deleted"
        });
    })

module.exports = router;