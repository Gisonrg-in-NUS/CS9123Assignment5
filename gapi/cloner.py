import json
import os
import subprocess
import sys

import filelock

BASE_PATH = 'var'
CLONE_PATH = os.path.join(BASE_PATH, 'repo')
FLAG_PATH = os.path.join(BASE_PATH, 'flag')
LOCK_PATH = os.path.join(BASE_PATH, 'lock')
BLAME_PATH = os.path.join(BASE_PATH, 'blame')


def create_lock(lock_path):
    directory = os.path.dirname(lock_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    try:
        with open(lock_path, 'x') as f:
            f.write('')
    except:
        pass


def touch_flag(flag_path):
    directory = os.path.dirname(flag_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    with open(flag_path, 'w') as f:
        f.write('')


def blame(repo):
    repo_path = os.path.join(CLONE_PATH, repo)
    blame_path = os.path.join(BLAME_PATH, repo)
    directory = os.path.dirname(blame_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
    p = subprocess.Popen(["git", "ls-files"], bufsize=1, stdout=subprocess.PIPE, cwd=repo_path).stdout
    lines = p.readlines()
    p.close()
    files = [i.decode().strip() for i in lines]

    authors = {}
    for filename in files:
        p = subprocess.Popen(["git", "blame", "--line-porcelain", filename], bufsize=1, stdout=subprocess.PIPE,
                             cwd=repo_path).stdout
        lines = p.readlines()
        p.close()
        author, author_mail = None, None
        for i in lines:
            try:
                s = i.strip().decode()
                if s.startswith('author '):
                    author = s.split(' ', 1)[1]
                elif s.startswith('author-mail '):
                    author_mail = s.split(' ', 1)[1][1:-1]
                    author_key = (author, author_mail)
                    if author_key not in authors:
                        authors[author_key] = 0
                    authors[author_key] += 1
            except UnicodeDecodeError:
                continue

    with open(blame_path, 'w') as f:
        json.dump(sorted([{'author': i[0], 'email': i[1], 'lines': authors[i]} for i in authors],
                         key=lambda x: x['lines']), f)


def clone(repo):
    lock_path = os.path.join(LOCK_PATH, repo)
    create_lock(lock_path)
    lock = filelock.FileLock(lock_path)
    with lock:
        flag_path = os.path.join(FLAG_PATH, repo)
        url = 'https://github.com/%s.git' % repo
        clone_path = os.path.join(CLONE_PATH, repo)
        if os.path.isfile(flag_path):
            os.remove(flag_path)
            subprocess.run(["git", "pull"], cwd=clone_path)
        else:
            subprocess.run(["git", "clone", url, clone_path])
        blame(repo)
        touch_flag(flag_path)


if __name__ == '__main__':
    repo = sys.argv[1]
    clone(repo)
