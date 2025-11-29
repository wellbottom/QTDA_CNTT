//GET /api/user


export const getUserData = async(req, res) => {
    try {
        const role = req.user.role;
        const image = req.user.image;
        const recentSearchedItems = req.user.recentSearchedItems;
        res.json({success: true, role, image, recentSearchedItems});
    } catch (error) {
       res.json({success: false, message: error.message}); 
    }
}

//POST /api/user/store-recent-search
export const storeRecentSearchItems = async(req, res) => {
    try {
        const {recentSearchedItem} = req.body;
        const user = req.user;

        if(user.recentSearchedItems.length >= 5){
            user.recentSearchedItems.shift(); //remove the oldest item
        }
        user.recentSearchedItems.push(recentSearchedItem);

        await user.save();
        res.json({success: true, message: "Recent searched items updated :" + recentSearchedItem });

    } catch (error) {
        res.json({success: false, message: error.message});
    }
}


