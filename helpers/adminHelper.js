const { response } = require('express');
const userSchema = require('../models/userModel');
const productSchema = require('../models/productModel');
const categorySchema = require('../models/category')




module.exports = {
    findUsers: () => {
        return new Promise(async (resolve, reject) => {
            await userSchema.find()
                .then((response) => {
                    resolve(response)
                }).catch((error) => {
                    console.log(error);
                    reject(error)
                })
        })
    },

    blockOrUnBlockUser: (userId) => {

        return new Promise(async (resolve, reject) => {
            const user = await userSchema.findById(userId);
            // if(user.isActive){
            //     req.session.user=false
            // }
            user.isActive = !user.isActive
            await user.save()

            resolve(user)
        })
    },

    findAUser: (userId) => {
        return new Promise(async (resolve, reject) => {
            await userSchema.findById({ _id: userId })
                .then((result) => {
                    resolve(result);
                })
                .catch((error) => {
                    console.log(error);
                })

        })
    },

    // salesReportPdf: (salesData) => {
    //     return new Promise(async (resolve, reject) => {
    //         // Create a document
    //         const doc = new PDFDocument();

    //         const stream = fs.createWriteStream('sales_report.pdf');
    //         doc.pipe(stream);

    //         doc.font('fonts/PalatinoBold.ttf')
    //             .fontSize(25)
    //             .text('Some text with an embedded font!', 100, 100);





    //         // Finalize PDF file
    //         doc.end();
    //         resolve(doc)
    //     })
    // }

}