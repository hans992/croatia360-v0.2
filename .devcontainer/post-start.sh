#!/bin/bash

echo "Starting post-start script..."

# Download Cloud SQL Auth Proxy if not already present
if [ ! -f /usr/local/bin/cloud-sql-proxy ]; then
  echo "Downloading Cloud SQL Auth Proxy..."
  wget https://storage.googleapis.com/cloud-sql-connectors/cloud-sql-proxy/v2.11.0/cloud-sql-proxy.linux.amd64 -O /usr/local/bin/cloud-sql-proxy
  chmod +x /usr/local/bin/cloud-sql-proxy
else
  echo "Cloud SQL Auth Proxy already exists."
fi

# --- Option A: Using a Service Account Key ---
# Check if the Service Account Key secret is set
if [ -n "$GCP_SERVICE_ACCOUNT_KEY_JSON" ]; then
  echo "Found GCP Service Account Key. Starting proxy..."
  # Create a temporary key file
  echo "$GCP_SERVICE_ACCOUNT_KEY_JSON" > /tmp/gcp-key.json
  # Start the proxy in the background
  # It will listen on 0.0.0.0:5432 inside the container and connect to your instance
  cloud-sql-proxy --credentials-file=/tmp/gcp-key.json "${GCP_SQL_INSTANCE_CONNECTION_NAME}" --port=5432 &
  # Optionally remove the key file after a short delay (consider security implications)
  # sleep 5 && rm /tmp/gcp-key.json &
  echo "Cloud SQL Auth Proxy started with Service Account."

# --- Option B: Using gcloud login (Requires manual step) ---
else
   echo "GCP Service Account Key not found."
   echo "Please run 'gcloud auth application-default login' in the terminal and follow the instructions."
   echo "Then, manually start the proxy in a separate terminal:"
   echo "cloud-sql-proxy ${GCP_SQL_INSTANCE_CONNECTION_NAME} --port=5432"
   # Note: Proxy won't start automatically in this case.
fi

echo "Post-start script finished."

