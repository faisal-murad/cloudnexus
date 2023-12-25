import product from "../database/modals/product.js";  

export const displayProduct = async (req, res) => {
    const products = await product.find().sort({ createdAt: "descending" });
    console.log(products); // Log the products
    res.send(products); // Send the products as a response
}
 

 
export const displayOneProduct = async(req,res)=>{
    const productId=req.params.id;
    const pro = await product.findById(productId);
    res.send(pro);
}

export const displayOneProductPrice = async (req, res) => {
    try {
        const productId = req.body.productId;// Assuming productId is sent as a string in the request body
      const pro = await product.findById(productId);
      
      if (!pro) {
        // Product not found
        return res.status(404).send("Product not found");
      }
  
      const toSend = {
        price:pro.price,
        image: pro.photo[0],
        proName: pro.name,
        
    };
      res.send(toSend);
    } catch (error) {
      console.error("Error fetching product price:", error);
      res.status(500).send("Internal Server Error");
    }
  };
  


  export const displayAllProducts = async (req, res) => {
    const products = await product.find().sort({ createdAt: "descending" });
    res.send(products);
}
export const displayProducts = async (req, res) => {
    const category = req.params.id;
    try {
        // Find all products with the given categoryId
        const products = await product.find({ category }).sort({ createdAt: "descending" });
        console.log(products); // Log the products
        res.send(products); // Send the filtered products as a response
    } catch (error) {
        console.error(error); // Handle any errors
        res.status(500).json({ error: "Internal server error" });
    }
}


export const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        // Attempt to delete the record using the _id field
        const result = await product.deleteOne({ _id: productId });

        if (result.deletedCount === 1) {
            res.json({ success: "Record deleted" });
        } else {
            res.status(404).json({ error: "Record not found" });
        }
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}



export const createProduct = async (req, res, next) => {
    const { name, price, details, category } = req.body; // Extract the 'name' property from the request body
    // const photo = req.files; // Assuming you're using multer to upload files 
    const photoFiles = req.files; // Assuming you're using multer to upload files

    const photoFilenames = photoFiles.map(file => file.filename); // Extract filenames from the uploaded files


product.create({ name,photo:photoFilenames, price, details, category})
        .then((data) => {
            console.log("Product added");
            console.log(data);
            res.send(data);
        })
        .catch((error) => {
            console.log("Caught an error: ", error);
            res.status(500).send("Error creating product");
        });
} 
 
// export const updateCategory = async (req, res) => {
//     //Get id off the url
//     try{

//         const categoryId = req.params.id;
        
//         //Get the data off the req body
//         const { name } = req.body; // Extract the 'name' property from the request body
//         // const photo = req.file.filename; // Assuming you're using multer to upload files
        
//         //Find and update the record
//         await categoryId.findByIdAndUpdate(categoryId, {
//         name: name,
//         // photo: photo,
//     });

//     const cate = await category.findById(categoryId);
//     //respond with it
//     res.json({ cate });
//     }
//     catch(err)
//     {
//         console.log("Error in updateCategory-controller ", err);
//     }
// };










