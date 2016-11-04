import os
import subprocess
import sys

import filelock

BASE_PATH = 'var'
CLONE_PATH = os.path.join(BASE_PATH, 'repo')
FLAG_PATH = os.path.join(BASE_PATH, 'flag')
LOCK_PATH = os.path.join(BASE_PATH, 'lock')


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
        touch_flag(flag_path)


if __name__ == '__main__':
    repo = sys.argv[1]
    clone(repo)
