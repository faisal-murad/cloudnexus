import category from "../database/modals/category.js"; 


export const displayCategory = async (req, res) => {
    const allPhotos = await category.find().sort({ createdAt: "descending" });
    res.send(allPhotos);
}
 
export const displayOneCategory = async(req,res)=>{
    const categoryId=req.params.id;
    const cat = await category.findById(categoryId);
    res.send(cat);
}


export const createCategory = async (req, res, next) => {
    const { name } = req.body; // Extract the 'name' property from the request body
    const photo = req.file.filename; // Assuming you're using multer to upload files

    category.create({ name, photo })
        .then((data) => {
            console.log("Uploaded successfully");
            console.log(data);
            res.send(data);
        })
        .catch((error) => {
            console.log("Caught an error: ", error);
            res.status(500).send("Error creating category");
        });
}

export const deleteCategory=async(req,res)=>{
    const categoryId=req.params.id;
    try {
        // Delete the record using the _id field
        const result = await category.deleteOne({ _id: categoryId });

        // Check if the deletion was successful
        if (result.deletedCount === 1) {
            res.json({ success: "Record deleted" });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        // Handle any errors that occurred during the deletion process
        res.status(500).json({ error: "Internal server error" });
    }
}
 

export const updateCategory = async (req, res) => {
    //Get id off the url
    try{

        const categoryId = req.params.id;
        
        //Get the data off the req body
        const { name } = req.body; // Extract the 'name' property from the request body
        // const photo = req.file.filename; // Assuming you're using multer to upload files
        
        //Find and update the record
        await categoryId.findByIdAndUpdate(categoryId, {
        name: name,
        // photo: photo,
    });

    const cate = await category.findById(categoryId);
    //respond with it
    res.json({ cate });
    }
    catch(err)
    {
        console.log("Error in updateCategory-controller ", err);
    }
};










