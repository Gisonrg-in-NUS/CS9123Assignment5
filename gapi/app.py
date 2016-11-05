import re

from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api

from gapi import check_repo, init_repo, is_repo_ready, file_log, blame, has_file

app = Flask(__name__)
api = Api(app)


class RepoInit(Resource):
    def get(self, user, repo):
        repo = '/'.join((user, repo))
        if check_repo(repo):
            init_repo(repo)
            return {'message': 'OK. Come back later.', 'repo': repo}
        else:
            return {'message': 'Not a valid GitHub repo.'}, 400


class FileHistory(Resource):
    def get(self, user, repo, filename):
        repo = '/'.join((user, repo))
        if not check_repo(repo):
            return {'message': 'Not a valid GitHub repo.'}, 400
        if not is_repo_ready(repo):
            return {'message': 'Wait ah...'}, 202
        if not has_file(repo, filename):
            return {'message': 'File not found.'}, 404
        linenos = request.args.get('lines')
        if linenos:
            match = re.match("\A(\d+),(\d+)\Z", linenos)
            if not match:
                linenos = None
        return file_log(repo, filename, linenos)


class Blame(Resource):
    def get(self, user, repo):
        repo = '/'.join((user, repo))
        if not check_repo(repo):
            return {'message': 'Not a valid GitHub repo.'}, 400
        if not is_repo_ready(repo):
            return {'message': 'Wait ah...'}, 202
        data = blame(repo)
        return data if data else {'message': 'Repo cloned. But I am still counting...'}, 202


api.add_resource(RepoInit, '/init/<user>/<repo>')
api.add_resource(FileHistory, '/file/<user>/<repo>/<path:filename>')
api.add_resource(Blame, '/blame/<user>/<repo>')

CORS(app)

if __name__ == '__main__':
    app.run(debug=True)
