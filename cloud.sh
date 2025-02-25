#!/bin/sh
# Run your React frontend against a cloud API server.
export REACT_APP_URL_PRE="https://jaxs-proj-annatx.pythonanywhere.com/"
echo "Starting React app with CLOUD backend at $REACT_APP_BACKEND_URL..."
npm start
