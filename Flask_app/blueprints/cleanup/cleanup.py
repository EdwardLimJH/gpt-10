from flask import Blueprint, request, jsonify, session
import os
from h2ogpte import H2OGPTE

H2O_API_KEY = os.getenv("H2O_API_KEY")

cleanup_bp = Blueprint('cleanup', __name__)

@cleanup_bp.route('/cleanup', methods=['DELETE'])
def cleanup():
    directory_path = './temp/'
    try:
        # Iterate over all files and subdirectories in the directory
        for root, dirs, files in os.walk(directory_path, topdown=False):
            for name in files:
                # Remove files
                os.remove(os.path.join(root, name))
            for name in dirs:
                # Remove subdirectories
                os.rmdir(os.path.join(root, name))
        
        # Remove the top-level directory itself
        os.rmdir(directory_path)
        print(f"Directory '{directory_path}' and its contents deleted successfully")
        result = {"success":"True"}
    except OSError as e:
        print(f"Error deleting directory '{directory_path}': {e}")
        result = {"success":"False"}
    
    # cleanup h2o.ai stuff
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )

    doc_id_list = request.form.get("doc_id_list")
    h2o_collection_id = request.form.get("collection_id")
    chat_session_id = request.form.get("chat_session_id")
    print("Deleting H2O chat session, collections, documents")
    h2o_client.delete_chat_sessions([chat_session_id,])
    h2o_client.delete_documents(doc_id_list)
    h2o_client.delete_collections([h2o_collection_id,])
    h2o_client.delete_upload(doc_id_list)
    return jsonify(result)