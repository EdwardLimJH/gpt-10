#!/bin/bash
# Start the Flask application
cd Flask_app/ 
python main.py &

# Start the React application
cd ../frontend/frontend-app
yarn start &

# Wait for any process to exit
wait -n

# Exit with the status of the process that exited first
exit $?