from flask import Blueprint, request, jsonify
import os
from h2ogpte import H2OGPTE

H2O_API_KEY = os.getenv("H2O_API_KEY")

cleanup_bp = Blueprint('cleanup', __name__)


def delete_directory(directory_path):
    """
    This function deletes the directory and its contents.

    Parameters:
    directory_path (str): The path of the directory to be deleted.

    Returns:
    dict: A dictionary indicating the success of the operation. If the directory and its contents are deleted successfully, the value of the "success" key will be "True". Otherwise, it will be "False".
    """
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
    return result

def teardown_h2o(chat_session_id_list, doc_id_list, h2o_collection_id_list):
    """
    This function deletes the H2O.ai Collection, chat sessions, and documents.

    Parameters:
    chat_session_id_list (list): A list of chat session IDs to be deleted.
    doc_id_list (list): A list of document IDs to be deleted.
    h2o_collection_id_list (list): A list of collection IDs to be deleted.

    Returns:
    dict: A dictionary indicating the success of the deletion operation.
    """
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key=H2O_API_KEY,
    )
    print("Deleting H2O chat sessions, collections, and documents")
    h2o_client.delete_chat_sessions(chat_session_id_list)
    h2o_client.delete_documents(doc_id_list)
    h2o_client.delete_collections(h2o_collection_id_list)
    for doc_id in doc_id_list:
        h2o_client.delete_upload(doc_id)
    return {"success": "True"}



@cleanup_bp.route('/cleanup', methods=['DELETE'])
def cleanup():
    """
    This route deletes the temporary directory created that stores user submitted files
    and deletes the H2O.ai Collection, chatsession, and documents.

    Returns:
        A JSON response containing the result of the cleanup operation.
    """
    result = delete_directory("./temp/")
    # cleanup h2o.ai stuff
    h2o_client = H2OGPTE(
        address='https://h2ogpte.genai.h2o.ai',
        api_key= H2O_API_KEY,
    )

    doc_id_list = request.form.get("doc_id_list")
    h2o_collection_id = request.form.get("collection_id")
    chat_session_id = request.form.get("chat_session_id")
    print("Deleting H2O chat session, collections, documents")
    result = teardown_h2o([chat_session_id], [doc_id_list], [h2o_collection_id])
    return jsonify(result)