import json
import os
import re
import subprocess
import sys

from common import get_flag_path, get_clone_path, get_blame_path

repo_regex = re.compile("\A([-_\w]+)/([-_.\w]+)\Z")
log_regex = re.compile("\A(.+)\|(.+)\|(.+)\|(.+)\|(.*)\Z")


def check_repo(repo):
    return bool(repo_regex.match(repo))


def init_repo(repo):
    subprocess.Popen([sys.executable, 'cloner.py', repo])


def is_repo_ready(repo):
    return os.path.isfile(get_flag_path(repo))


def has_file(repo, filename):
    repo_path = get_clone_path(repo)
    return os.path.isfile(os.path.join(repo_path, filename))


def file_log(repo, filename, linenos):
    cmds = ["git", "log", '--format=%ct|%cN|%cE|%H|%s']
    if linenos:
        cmds += ["-L", ":".join((linenos, filename))]
    else:
        cmds += ["--", filename]
    repo_path = get_clone_path(repo)
    p = subprocess.Popen(cmds, bufsize=1, stdout=subprocess.PIPE, cwd=repo_path).stdout
    lines = p.readlines()
    p.close()
    result = []
    for i in lines:
        match = log_regex.match(i.decode().strip())
        if match:
            groups = match.groups()
            result.append(
                {'time': groups[0], 'author': groups[1], 'email': groups[2], 'commit': groups[3], 'message': groups[4]})
        else:
            break
    return result


def blame(repo):
    blame_path = get_blame_path(repo)
    if os.path.isfile(blame_path):
        with open(blame_path, 'r') as f:
            return json.load(f)
    return None
