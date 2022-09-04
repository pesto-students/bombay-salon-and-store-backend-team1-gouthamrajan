const addUserDetailsToRequest = async (req, res, next) => {
	try {
		// compute whether user is admin or not. 
		req.user = {
			user_id: '6310cbd187b9f9f601f8de7a', // update later
			name: 'Akash'
		}
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = addUserDetailsToRequest