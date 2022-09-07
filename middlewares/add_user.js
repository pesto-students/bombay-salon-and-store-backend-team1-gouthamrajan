const addUserDetailsToRequest = async (req, res, next) => {
	try {
		// compute whether user is admin or not. 
		req.user = {
			user_id: '123',
			name: 'Akash'
		}
		next()
	} catch (error) {
		next(error)
	}
}

module.exports = addUserDetailsToRequest