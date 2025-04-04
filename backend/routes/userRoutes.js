router.get('/all', async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
}); 