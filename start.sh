#!/bin/bash

# Run backend application in the background
cd /path/to/backend
npm start &

# Wait for a few seconds to allow backend to start up
sleep 5

# Run frontend application
cd /path/to/frontend
npm start