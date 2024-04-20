FROM nikolaik/python-nodejs:python3.12-nodejs18-slim

## Add Python script, requirements file and templates folder to /app 
## directory on the image:
WORKDIR /app

COPY Flask_app ./Flask_app
COPY frontend ./frontend
COPY entrypoint.sh /usr/local/bin/

# Install backend packages
RUN pip3 install --upgrade pip
# RUN pip3 install -r Flask_app/requirements.txt
RUN pip3 install -r Flask_app/requirements_min.txt
# Install frontend requirements
RUN cd frontend/frontend-app && \
yarn

# Make port 3000 available to the world outside this container for React app
EXPOSE 3000

# Make port 5000 available for the Flask app
EXPOSE 5000

# Grant permissions for the entrypoint.sh to be executable
RUN chmod +x /usr/local/bin/entrypoint.sh

# Define the script we want to run once the container starts
ENTRYPOINT ["entrypoint.sh"]