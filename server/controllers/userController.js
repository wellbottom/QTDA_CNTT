//GET /api/user


export const getUserData = async(req, res) => {
    try {
        const role = req.user.role;
        const image = req.user.image;
        res.json({success: true, role, image});
    } catch (error) {
       res.json({success: false, message: error.message}); 
    }
}


