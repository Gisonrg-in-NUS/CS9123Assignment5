import re

from flask import Flask, request
from flask_restful import Resource, Api

from gapi import check_repo, init_repo, is_repo_ready, file_log, blame

app = Flask(__name__)
api = Api(app)


class RepoInit(Resource):
    def get(self, repo):
        if check_repo(repo):
            init_repo(repo)
            return {'message': 'OK. Come back later.', 'repo': repo}
        else:
            return {'message': 'Not a valid GitHub repo.'}, 400


class FileHistory(Resource):
    def get(self, repo):
        if not check_repo(repo):
            return {'message': 'Not a valid GitHub repo.'}, 400
        if not is_repo_ready(repo):
            return {'message': 'Wait ah...'}, 202
        filename = request.args['file']
        linenos = request.args.get('lines')
        if linenos:
            match = re.match("\A(\d+),(\d+)\Z", linenos)
            if not match:
                linenos = None
        return file_log(repo, filename, linenos)


class Blame(Resource):
    def get(self, repo):
        if not check_repo(repo):
            return {'message': 'Not a valid GitHub repo.'}, 400
        if not is_repo_ready(repo):
            return {'message': 'Wait ah...'}, 202
        return blame(repo)


api.add_resource(RepoInit, '/init/<path:repo>')
api.add_resource(FileHistory, '/file/<path:repo>')

if __name__ == '__main__':
    app.run(debug=True)
