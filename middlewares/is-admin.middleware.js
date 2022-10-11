const isUserAdmin = async (req, res, next) => {
	try {
		// compute whether user is admin or not. 
		const isAdmin = true;
		if(isAdmin) return next();
		else {
			return res.status(403).json({
				message: 'You do not have permissions to access the requested resource'
			})
		}
	} catch (error) {
		next(error)
	}
}

module.exports = isUserAdmin