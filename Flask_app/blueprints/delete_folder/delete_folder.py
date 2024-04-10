from flask import Blueprint, request, jsonify, session
import os
from h2ogpte import H2OGPTE

H2O_API_KEY = os.getenv("H2O_API_KEY")

delete_folder_bp = Blueprint('delete_folder', __name__)

@delete_folder_bp.route('/delete_folder', methods=['DELETE'])
def delete_folder():
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
    doc_id_list = session["doc_id_list"]
    h2o_collection_id = session["collection_id"]
    chat_session_id = session["chat_session_id"]
    print(doc_id_list,h2o_collection_id, chat_session_id)
    h2o_client.delete_chat_sessions([chat_session_id,])
    h2o_client.delete_documents(doc_id_list)
    h2o_client.delete_collections([h2o_collection_id,])
    h2o_client.delete_upload(doc_id_list)
    return jsonify(result)