const LogoutController = {};

LogoutController.Logout = async(req,res) =>{
    try {
        res.clearCookie("token");

        return res.status(200).json({message: "Logout Success"})
    } catch (error) {
        console.log("error" + error);
        return res.status(500).json({message: "Internal Server Error" + error})
    }
}

export default LogoutController;