import express, { Request, Response} from 'express';
const verifyToken = require("../middleware/jwt");
const router = express.Router();


// Create reminder
router.post("/", verifyToken, async (req: Request, res: Response) => {

});



// update reminder
router.put("/", verifyToken, async (req: Request, res: Response) => {

});

// delete reminder
router.delete("/:id", verifyToken, async (req: Request, res: Response) => {

});

// get reminder by id
router.get("/:id", verifyToken, async (req: Request, res: Response) => {

});

// get all reminders by user
router.get("/", verifyToken, async (req: Request, res: Response) => {

});



module.exports = router;