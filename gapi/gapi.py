import os
import re
import subprocess
import sys

BASE_PATH = 'var'
CLONE_PATH = os.path.join(BASE_PATH, 'repo')
FLAG_PATH = os.path.join(BASE_PATH, 'flag')

repo_regex = re.compile("\A([-_\w]+)/([-_.\w]+)\Z")
log_regex = re.compile("\A(.+)\|(.+)\|(.+)\|(.+)\|(.*)\Z")


def check_repo(repo):
    return bool(repo_regex.match(repo))


def init_repo(repo):
    subprocess.Popen([sys.executable, 'cloner.py', repo])
    return True


def is_repo_ready(repo):
    flag_path = os.path.join(FLAG_PATH, repo)
    return os.path.isfile(flag_path)


def file_log(repo, filename, linenos):
    cmds = ["git", "log", '--format=%ct|%cN|%cE|%H|%s']
    if linenos:
        cmds += ["-L", ":".join((linenos, filename))]
    else:
        cmds += ["--", filename]

    repo_path = os.path.join(CLONE_PATH, repo)
    print(' '.join(cmds))
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
    return []
