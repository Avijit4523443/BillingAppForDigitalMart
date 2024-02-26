const uploadFile = require("../middlewares/multer");
const UserDetailsModel = require("../model/UserDetailsModel");

const uploadUserDetails = async (req, res) => {
    uploadFile(req, res, async function (err) {
        if (err && err.code == 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ status: false, msg: "Please upload file less than 500kb !" })
        }
        else if (err) {
            return res.status(500).json({ status: false, msg: 'Something went wrong !' })
        }
        else {
            try {

                let { mobNo, address, brandName, email } = req.body;

                if (!mobNo || !address || !brandName || !email) {
                    return res.status(400).json({ status: false, msg: 'Bad Request !' })
                }
                if (!req.file) {
                    return res.status(400).json({ status: false, msg: "Please upload an image !" })
                }
                let brandImg = req.file.buffer;

                const userDetails = await UserDetailsModel.updateOne({ user: req.user.userId }, { mobNo, address, brandName, brandImg, email });
                
                if (userDetails.matchedCount == 1) {
                    return res.status(200).json({ status: true, userDetails });
                }
                return res.status(500).json({ status: false, msg: 'something went wrong !' });

            }
            catch (err) {
                res.status(400).json({ status: false, msg: 'Invalid Request !' })
            }
        }
    })

}

const getUserDetails = async (req, res) => {
    try {
        const userDetails = await UserDetailsModel.findOne({ user: req.user.userId });
        if (userDetails) {
            return res.status(200).json({ status: true, userDetails });
        }
        return res.status(400).json({ status: false, msg: "Something went wrong !" })
    }
    catch (err) {
        res.status(500).json({ status: false, msg: 'Somthing went wrong !' })
    }
}

module.exports = { uploadUserDetails, getUserDetails };