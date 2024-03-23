from flask import Blueprint, request, jsonify
import os

delete_folder_bp = Blueprint('delete_folder', __name__)

@delete_folder_bp.route('/delete_folder', methods=['DELETE'])
def delete_folder():
    directory_path = request.args.get('directory_path', './temp/')
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
    
    return jsonify(result)